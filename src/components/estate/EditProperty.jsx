"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation"; // To get the ID from the URL
import { update_property, get_property, messageClear } from "@/store/estate"; // Replace with your actual update/fetch actions
import toast from "react-hot-toast";
import Dropdown from "@/components/ui/DropDown";
import Input from "@/components/ui/Input";
import AddressMiniMap from "@/components/Map";

const EditProperty = ({ id }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  // Assuming your Redux state holds the fetched property in 'property'
  const { loader, successMessage, errorMessage, property } = useSelector(
    (state) => state.estate
  );

  const [formData, setFormData] = useState({
    province: "", postal_code: "", city: "", street: "", street_number: "",
    public_address: "Hide street number", district: "", area: "",
    status: "", reference: "", type: "", floor: "", rooms: "", bathrooms: "",
    surface: "", usable_surface: "", year_of_construction: "", community_expenses: "",
    transaction_type: "sale", show_price_tags: false,
    energy_consumption: "", co2_emissions: "", energy_certificate_type: "", emission_certificate_type: "",
    description: "", labels: "", owner_1: "", owner_2: "", owner_3: "", capturer: "", commercial_manager: "",
  });

  // 1. Fetch property data when component mounts
  useEffect(() => {
    if (id) {
      dispatch(get_property(id));
    }
  }, [id, dispatch]);

  // 2. Populate form data when the property is loaded from Redux
  useEffect(() => {
    if (property) {
      setFormData({
        province: property.province || "",
        postal_code: property.postal_code || "",
        city: property.city || "",
        street: property.street || "",
        street_number: property.street_number || "",
        public_address: property.public_address || "",
        district: property.district || "",
        area: property.area || "",
        status: property.status || "", 
        reference: property.reference || "",
        type: property.type || "",
        floor: property.floor || "", 
        rooms: property.rooms?.toString() || "",
        bathrooms: property.bathrooms?.toString() || "",
        surface: property.surface?.toString() || "",
        usable_surface: property.usable_surface?.toString() || "",
        year_of_construction: property.year_of_construction?.toString() || "",
        community_expenses: property.community_expenses?.toString() || "",
        transaction_type: property.transaction_type || "sale",
        show_price_tags: property.show_price_tags || false,
        energy_consumption: property.energy_consumption || "",
        co2_emissions: property.co2_emissions || "",
        energy_certificate_type: property.energy_certificate_type || "",
        emission_certificate_type: property.emission_certificate_type || "",
        description: property.description || "",
        labels: property.labels || "",
        owner_1: property.owner_1 || "",
        owner_2: property.owner_2 || "",
        owner_3: property.owner_3 || "",
        capturer: property.capturer || "",
        commercial_manager: property.commercial_manager || "",
      });
    }
  }, [property]);

  // 3. Handle Success/Error Messages
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      // Optional: Redirect back to property list after successful edit
      // router.push('/dashboard/properties'); 
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch, router]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.reference.trim() === "") return toast.error("reference is required");
    if (formData.street.trim() === "") return toast.error("street is required");

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null) {
        data.append(key, formData[key]);
      }
    });

    // Dispatch the update action instead of create
    // Make sure your update_property action knows which ID to update
    dispatch(update_property({ id, data })); 
  };

  const fullAddress = `${formData.street} ${formData.street_number}, ${formData.city}, ${formData.province}`;

  // --- Static Options (Keep exactly as they were) ---
  const areaOptions = [
    { label: "ALBOLOTE", value: "ALBOLOTE" },
    { label: "ARMILLA", value: "ARMILLA" },
    { label: "Alella Park", value: "Alella Park" },
    { label: "Antiga Esquerra de l'Eixample", value: "Antiga Esquerra de l'Eixample" },
    // ... truncated for brevity, but keep all your original options here ...
  ];

  const typeOptions = [
    { label: "Floor", value: "flat" },
    { label: "House Chalet", value: "chalet" },
    { label: "Rustic House", value: "country_house" },
    { label: "Bungalow", value: "bungalow" },
    // ... keep all your original options here ...
  ];

  const floorOptions = [
    { label: "Basement 3", value: "-3" },
    { label: "Basement 2", value: "-2" },
    { label: "Basement 1", value: "-1" },
    { label: "Low", value: "0" },
    { label: "Mezzanine", value: "mezzanine" },
    { label: "Semi-basement", value: "semi-basement" },
    ...Array.from({ length: 99 }, (_, i) => ({
      label: (i + 1).toString(),
      value: (i + 1).toString(),
    })),
  ];
  // ------------------------------------------------

  return (
    <div className="w-full bg-white min-h-screen pb-24">
      <form onSubmit={handleSubmit} className="space-y-10">
        
        {/* SECTION 1: LOCATION DETAILS */}
        <section className="p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-6 border-b pb-2">Location Details</h2>
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="w-full lg:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
              <Input label="Province" name="province" value={formData.province} onChange={handleChange} />
              <Input label="Postal Code" name="postal_code" value={formData.postal_code} onChange={handleChange} required />
              <div className="md:col-span-2">
                <Input label="City" name="city" value={formData.city} onChange={handleChange} required />
              </div>
              <Input label="Street" name="street" value={formData.street} onChange={handleChange} required />
              <Input label="Street Number" name="street_number" value={formData.street_number} onChange={handleChange} required />
              <div className="md:col-span-2">
                <Dropdown label="Public Address*" name="public_address" title="Select Option" value={formData.public_address} onChange={handleChange} 
                  options={[
                    { label: "See all", value: "See all" },
                    { label: "Hide street number", value: "Hide street number" },
                    { label: "Hide street", value: "Hide street" },
                    { label: "Hide everything", value: "Hide everything" },
                  ]}
                />
              </div>
              <Input label="District" name="district" value={formData.district} onChange={handleChange} />
              <Dropdown label="Zone" name="area" title="Select Zone/Area" value={formData.area} onChange={handleChange} options={areaOptions} />
            </div>
            <div className="w-full lg:w-1/2">
              <AddressMiniMap address={fullAddress} />
              <p className="text-xs text-blue-600 mt-2 text-right cursor-pointer">Click here to manually adjust location</p>
            </div>
          </div>
        </section>

        {/* SECTION 2: PROPERTY FEATURES */}
        <section className="p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-6 border-b pb-2">Property Features</h2>
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="w-full lg:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
              <Dropdown label="Status" name="status" title="Select Status" value={formData.status} onChange={handleChange} 
                options={[
                  { label: "Prospectus", value: "prospectus" }, { label: "Available", value: "available" },
                  { label: "Reserved", value: "reserved" }, { label: "Rented", value: "rented" },
                  { label: "Sold", value: "sold" }, { label: "Inactive", value: "inactive" },
                ]}
              />
              <Input label="Reference" name="reference" value={formData.reference} onChange={handleChange} required />
              <Dropdown label="Type" name="type" title="Select Type" value={formData.type} onChange={handleChange} options={typeOptions} />
              <Dropdown label="Floor" name="floor" title="Select Floor" value={formData.floor} onChange={handleChange} options={floorOptions} />
              <Dropdown label="Rooms" name="rooms" title="Select number of rooms" value={formData.rooms} onChange={handleChange} 
                options={Array.from({ length: 31 }, (_, i) => ({ label: i.toString(), value: i.toString() }))}
              />
              <Dropdown label="Bathrooms" name="bathrooms" title="Select number of bathrooms" value={formData.bathrooms} onChange={handleChange} 
                options={Array.from({ length: 31 }, (_, i) => ({ label: i.toString(), value: i.toString() }))}
              />
              <Input label="Surface m²" type="number" name="surface" value={formData.surface} onChange={handleChange} />
              <Input label="Usable Surface m²" type="number" name="usable_surface" value={formData.usable_surface} onChange={handleChange} />
              <Input label="Year of Construction" type="number" name="year_of_construction" value={formData.year_of_construction} onChange={handleChange} />
              <Input label="Community Expenses" type="number" name="community_expenses" value={formData.community_expenses} onChange={handleChange} />
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-green-500 outline-none" />
              </div>
              <div className="md:col-span-2">
                <Input label="Labels / Tags" name="labels" placeholder="e.g. Luxury, Sea View" value={formData.labels} onChange={handleChange} />
              </div>
            </div>
            <div className="w-full lg:w-1/2"></div>
          </div>
        </section>

        {/* SECTION 3: ENERGY */}
        <section className="p-6 bg-green-50/30">
          <h2 className="text-lg font-bold text-gray-800 mb-6 border-b pb-2">Energy Certificate</h2>
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="w-full lg:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Dropdown label="Energy Type" name="energy_certificate_type" title="Select energy certificate type" value={formData.energy_certificate_type} onChange={handleChange} 
                options={[
                  { label: "A", value: "A" }, { label: "B", value: "B" }, { label: "C", value: "C" },
                  { label: "D", value: "D" }, { label: "E", value: "E" }, { label: "F", value: "F" },
                  { label: "G", value: "G" }, { label: "Not specified", value: "not_specified" },
                  { label: "In process", value: "pending" }, { label: "Exempt", value: "exempt" },
                ]}
              />
              <Dropdown label="Emission Type" name="emission_certificate_type" title="Select emission certificate type" value={formData.emission_certificate_type} onChange={handleChange} 
                options={[
                  { label: "A", value: "A" }, { label: "B", value: "B" }, { label: "C", value: "C" },
                  { label: "D", value: "D" }, { label: "E", value: "E" }, { label: "F", value: "F" },
                  { label: "G", value: "G" }, { label: "Not specified", value: "not_specified" },
                  { label: "In process", value: "pending" }, { label: "Exempt", value: "exempt" },
                ]}
              />
              <Input label="Consumption kWh/m²" type="number" name="energy_consumption" value={formData.energy_consumption} onChange={handleChange} />
              <Input label="CO2 Emission kg/m²" type="number" name="co2_emissions" value={formData.co2_emissions} onChange={handleChange} />
            </div>
            <div className="w-full lg:w-1/2"></div>
          </div>
        </section>

        {/* SECTION 4: PRIVATE DATA */}
        <section className="p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-6 border-b pb-2">Private Data</h2>
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="w-full lg:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Dropdown label="Owner 1" name="owner_1" title="select owner 1" value={formData.owner_1} onChange={handleChange} options={[]} />
              <Dropdown label="Owner 2" name="owner_2" title="select owner 2" value={formData.owner_2} onChange={handleChange} options={[]} />
              <Dropdown label="Owner 3" name="owner_3" title="select owner 3" value={formData.owner_3} onChange={handleChange} options={[]} />
              <Dropdown label="Capturer" name="capturer" title="select capturer" value={formData.capturer} onChange={handleChange} options={[]} />
              <Dropdown label="Commercial Manager" name="commercial_manager" title="select commercial manager" value={formData.commercial_manager} onChange={handleChange} options={[]} />
            </div>
            <div className="w-full lg:w-1/2"></div>
          </div>
        </section>

        {/* SAVE BAR */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-center shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-50">
          <button
            type="submit"
            disabled={loader}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-24 py-2 rounded font-bold transition-all"
          >
            {loader ? "Updating..." : "Update Property"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProperty;