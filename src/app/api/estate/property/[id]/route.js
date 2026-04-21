import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Property from "@/models/Property";
import path from "path";
import { writeFile, mkdir, unlink, access } from "fs/promises";
import sharp from 'sharp';

export async function GET(req, context) {
    const { id } = await context.params;
    try {
        await dbConnect();

        const property = await Property.findById(id);

        if (!property) {
            return NextResponse.json(
                { message: "Property not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(
            {
                success: true,
                data: property,
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Internal Server Error", error: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(request, context) {
    const { id } = await context.params;

    try {
        await dbConnect();

        const formData = await request.formData();
        const updateData = {};

        // 2. Dynamically build the update object
        for (const [key, value] of formData.entries()) {
            // Skip labels in the loop so we can handle it as an array below
            if (key === 'labels') continue;
            if (key === 'images') continue;
            if (key === 'portals') continue;

            // Convert stringified booleans back to real booleans
            if (value === 'true') {
                updateData[key] = true;
            } else if (value === 'false') {
                updateData[key] = false;
            }
            // Convert empty strings to null to prevent Mongoose CastErrors 
            // (e.g., clearing a number field like "surface" or "rent_price")
            else if (value === '') {
                updateData[key] = null;
            }
            // Standard string/number values
            else {
                updateData[key] = value;
            }
        }

        const files = formData.getAll("images");

        if (!files || files.length === 0) {
            console.log("No images provided in the form data.");
        }

        const savedImageUrls = [];

        // Define the upload path (public/uploads/properties)
        const uploadDir = path.join(process.cwd(), "public", "estate", "uploads", "images");

        // Ensure directory exists
        await mkdir(uploadDir, { recursive: true });

        for (const file of files) {

            if (typeof file === "string") {
                savedImageUrls.push(file);
                continue;
            }

            if (!file || !file.name) {
                console.log("Skipping invalid file entry", file);
                continue;
            }

            // Create a unique filename
            const uniqueName = `${Date.now()}_${file.name.replaceAll(" ", "_")}`;
            const filePath = path.join(uploadDir, uniqueName);

            // Convert file to Buffer
            const byteData = await file.arrayBuffer();
            const buffer = Buffer.from(byteData);

            const metadata = await sharp(buffer).metadata();
            const { width, height } = metadata;

            const watermarkSvg = `
                <svg width="${width}" height="${height}">
                  <style>
                    .watermark { 
                        fill: rgba(0, 255, 0, 0.4); /* Pure Green with 40% opacity */
                        font-size: 48px; 
                        font-family: sans-serif; 
                        font-weight: bold; 
                    }
                  </style>
                  <text x="50%" 
                        y="50%" 
                        text-anchor="middle" 
                        class="watermark"
                        transform="rotate(-45, ${width / 2}, ${height / 2})">HIHOMIE
                  </text>
                </svg>
            `;

            const processedImage = await sharp(buffer)
                .composite([
                    {
                        input: Buffer.from(watermarkSvg),
                        gravity: 'center',
                        // tile: true, // Repeat the watermark across the image
                    },
                ])
                .jpeg({ quality: 90 }) // "Bakes" it into a flat JPEG
                .toBuffer();

            const filename = `watermarked_${Date.now()}.jpg`;
            const pathname = path.join(uploadDir, filename);

            await writeFile(pathname, processedImage);

            // Write to public folder
            await writeFile(filePath, buffer);

            // Save relative URL for DB
            savedImageUrls.push(`/estate/uploads/images/${filename}`);
        }
        updateData.images = savedImageUrls;

        updateData.labels = formData.has('labels') ? formData.getAll('labels') : [];
        updateData.portals = formData.has('portals') ? formData.getAll('portals') : [];

        const currentProperty = await Property.findById(id);
        if (currentProperty && currentProperty.images) {
            // 2. Identify images that were in the DB but are NOT in our new savedImageUrls list
            const imagesToDelete = currentProperty.images.filter(
                (oldImg) => !savedImageUrls.includes(oldImg)
            );

            // 3. Delete those files from the physical server
            for (const imgPath of imagesToDelete) {
                try {
                    const fullPathToDelete = path.join(process.cwd(), "public", imgPath);

                    // Check if file exists before trying to delete
                    await access(fullPathToDelete);
                    await unlink(fullPathToDelete);
                } catch (err) {
                    console.error(`Failed to delete ${imgPath}:`, err.message);
                }
            }
        }

        // 4. Update the document in MongoDB
        const updatedProperty = await Property.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedProperty) {
            return NextResponse.json(
                { success: false, message: "Property not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Property updated successfully!",
                data: updatedProperty,
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("PUT Error:", error);
        return NextResponse.json(
            { success: false, message: "Internal Server Error", error: error.message },
            { status: 500 }
        );
    }
}