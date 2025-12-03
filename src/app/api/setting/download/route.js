import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db';
import LeadStatus from "@/models/LeadStatus";
import CardAssignUser from '@/models/CardAssignUser';

export async function POST(request) {
    try {
        const { from_date, to_date, user_id, user_role, selected_user } = await request.json();

        await dbConnect();

        // Conditionally get the cards assigned to the manager
        let assignedCardIds = [];
        if (user_role !== 'admin') {
            const assignedCards = await CardAssignUser.find({ userId: user_id }).lean();
            assignedCardIds = assignedCards.map(card => new mongoose.Types.ObjectId(card.cardId));

            // If a manager has no assigned cards, return an empty array early
            if (assignedCardIds.length === 0) {
                return [];
            }
        }
        else {
            if (selected_user) {
                const assignedCards = await CardAssignUser.find({ userId: selected_user }).lean();
                assignedCardIds = assignedCards.map(card => new mongoose.Types.ObjectId(card.cardId));
            }
            else {
                const allCardIds = await CardAssignUser.find().distinct('cardId');
                // Convert all distinct cardId strings to ObjectId objects
                assignedCardIds = allCardIds.map(id => new mongoose.Types.ObjectId(id));
            }
        }

        const pipeline = [
            // 1. Unwind the 'category' array to work with individual category documents.
            { $unwind: '$cards' },
            {
                $addFields: {
                    'cards.stringId': { $toString: '$cards._id' }
                }
            },

            {
                $match: {
                    'cards._id': {
                        $in: assignedCardIds
                    }
                }
            },
            {
                $lookup: {
                    from: 'cardassignusers',
                    localField: 'cards.stringId',
                    foreignField: 'cardId',
                    as: 'assignedUser'
                }
            },
            {
                // This is the corrected lookup for 'users'
                $lookup: {
                    from: 'users',
                    // 'let' creates a variable 'userIds' that holds the array of user IDs from the previous stage
                    let: { userIds: '$assignedUser.userId' },
                    // The pipeline will execute on the 'users' collection
                    pipeline: [
                        {
                            // We match documents where the user's '_id' is in our '$$userIds' array
                            $match: {
                                $expr: {
                                    $in: [{ $toString: '$_id' }, '$$userIds']
                                }
                            }
                        }
                        // You could add a $project stage here to shape the user documents if needed
                    ],
                    // The result will be an array of the full user documents
                    as: 'actualUser'
                }
            }
        ];

        // Conditionally add the date range match stage
        if (from_date || to_date) {
            const dateMatch = {};
            if (from_date) {
                dateMatch['$gte'] = new Date(from_date);
            }
            if (to_date) {
                dateMatch['$lte'] = new Date(to_date);
            }

            pipeline.push({
                $match: {
                    'cards.createdAt': dateMatch
                }
            });
        }

        pipeline.push({
            $project: {
                _id: 0,
                status_name: '$status_name',
                lead_title: '$cards.lead_title',
                surname: '$cards.surname',
                first_name: '$cards.first_name',
                last_name: '$cards.last_name',
                company: '$cards.company',
                designation: '$cards.designation',
                email: '$cards.email',
                phone: '$cards.phone',
                lead_value: '$cards.lead_value',
                type_of_opration: '$cards.type_of_opration',
                customer_situation: '$cards.customer_situation',
                purchase_status: '$cards.purchase_status',
                contacted: '$cards.contacted',
                contract_signed: '$cards.contract_signed',
                commercial_notes: '$cards.commercial_notes',
                manager_notes: '$cards.manager_notes',
                source: '$cards.detailsData.source',
                tag: '$cards.detailsData.tag',
                last_connected: '$cards.detailsData.last_connected',
                notes: '$cards.detailsData.notes',
                company_name: '$cards.addressDetailsData.company_name',
                street: '$cards.addressDetailsData.street',
                city: '$cards.addressDetailsData.city',
                state: '$cards.addressDetailsData.state',
                zip: '$cards.addressDetailsData.zip_code',
                country: '$cards.addressDetailsData.country',
                website: '$cards.addressDetailsData.website',
                createdAt: '$cards.createdAt',
                assigned_to: {
                    $reduce: {
                        input: {
                            $map: {
                                input: '$actualUser',
                                as: 'user',
                                in: '$$user.email'
                            }
                        },
                        initialValue: '',
                        in: {
                            $concat: [
                                '$$value',
                                {
                                    $cond: {
                                        if: { $eq: ['$$value', ''] },
                                        then: '',
                                        else: ', '
                                    }
                                },
                                '$$this'
                            ]
                        }
                    }
                }
            },
        })

        const leads = await LeadStatus.aggregate(pipeline);

        // Create a new workbook
        const workbook = XLSX.utils.book_new();

        // Convert JSON data to a worksheet
        const worksheet = XLSX.utils.json_to_sheet(leads);

        // Add the worksheet to the workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, 'User Data');

        // Generate a buffer from the workbook
        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        // Use NextResponse to send the buffer with the appropriate headers
        return new NextResponse(buffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': 'attachment; filename="data-export.xlsx"',
            },
        });

    } catch (error) {
        console.error('Error exporting data:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}