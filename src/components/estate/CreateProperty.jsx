"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { create_property, get_tags, messageClear } from "@/store/estate";
import toast from "react-hot-toast";
import Dropdown from "@/components/ui/DropDown";
import Input from "@/components/ui/Input";
import AddressMiniMap from "@/components/Map";
import { set } from "mongoose";

const CreateProperty = () => {
  const dispatch = useDispatch();
  const { loader, successMessage, errorMessage, tags } = useSelector(
    (state) => state.estate,
  );

  const [formData, setFormData] = useState({
    province: "",
    postal_code: "",
    city: "",
    street: "",
    street_number: "",
    public_address: "",
    district: "",
    area: "",
    status: "",
    reference: "",
    type: "",
    floor: "",
    rooms: "",
    bathrooms: "",
    surface: "",
    usable_surface: "",
    year_of_construction: "",
    community_expenses: "",
    transaction_type: "sale",
    show_price_tags: false,
    energy_consumption: "",
    co2_emissions: "",
    energy_certificate_type: "",
    emission_certificate_type: "",
    description: "",
    labels: [],
    owner_1: "",
    owner_2: "",
    owner_3: "",
    capturer: "",
    commercial_manager: "",
    video_link: "",
  });

  const areaOptions = [
    { label: "ALBOLOTE", value: "ALBOLOTE" },
    { label: "ARMILLA", value: "ARMILLA" },
    { label: "Alella Park", value: "Alella Park" },
    {
      label: "Antiga Esquerra de l'Eixample",
      value: "Antiga Esquerra de l'Eixample",
    },
    { label: "Arenys de Mar", value: "Arenys de Mar" },
    { label: "Arenys de Munt", value: "Arenys de Munt" },
    { label: "Weapon", value: "Weapon" },
    { label: "Artigues Sant Adrià", value: "Artigues Sant Adrià" },
    { label: "Badalona Port", value: "Badalona Port" },
    {
      label: "Badalona President Companys",
      value: "Badalona President Companys",
    },
    { label: "Badalona center", value: "Badalona center" },
    { label: "Badalona_Dr.Robert", value: "Badalona_Dr.Robert" },
    { label: "Don Zolio Barranquillo", value: "Don Zolio Barranquillo" },
    { label: "Marnresà neighborhood", value: "Marnresà neighborhood" },
    { label: "Bellresguard", value: "Bellresguard" },
    { label: "Bonavista", value: "Bonavista" },
    { label: "Bonavista tennis", value: "Bonavista tennis" },
    { label: "Bufala", value: "Bufala" },
    { label: "CARCHUNA", value: "CARCHUNA" },
    { label: "CHURRIANA", value: "CHURRIANA" },
    { label: "CLOT", value: "CLOT" },
    { label: "Ca l'Artigues", value: "Ca l'Artigues" },
    { label: "Calafell beach", value: "Calafell beach" },
    { label: "Caldes de Montbui", value: "Caldes de Montbui" },
    { label: "Caleta de Vélez", value: "Caleta de Vélez" },
    { label: "Cambrils", value: "Cambrils" },
    { label: "Can Calvet", value: "Can Calvet" },
    { label: "Can Claramunt", value: "Can Claramunt" },
    { label: "Canet de mar", value: "Canet de mar" },
    { label: "Canyado-Casagemes", value: "Canyado-Casagemes" },
    { label: "Canyado", value: "Canyado" },
    { label: "Canyelles", value: "Canyelles" },
    { label: "Canyet", value: "Canyet" },
    { label: "Cap Salou", value: "Cap Salou" },
    { label: "Casagemes", value: "Casagemes" },
    { label: "Castellarnau", value: "Castellarnau" },
    { label: "Centre", value: "Centre" },
    { label: "Center", value: "Center" },
    { label: "Badalona Center", value: "Badalona Center" },
    { label: "Palamós Center", value: "Palamós Center" },
    { label: "Cerdanyola", value: "Cerdanyola" },
    { label: "Concordia Sabadell", value: "Concordia Sabadell" },
    { label: "Congress", value: "Congress" },
    { label: "Corbera", value: "Corbera" },
    { label: "Cubelles", value: "Cubelles" },
    { label: "Dalt De La Vila", value: "Dalt De La Vila" },
    { label: "Diagonal-Colomeres", value: "Diagonal-Colomeres" },
    { label: "EIXAMPLE DRET", value: "EIXAMPLE DRET" },
    {
      label: "EIXAMPLE DRET SACRED FAMILY",
      value: "EIXAMPLE DRET SACRED FAMILY",
    },
  ];

  const typeOptions = [
    { label: "Floor", value: "flat" },
    { label: "House Chalet", value: "chalet" },
    { label: "Rustic House", value: "country_house" },
    { label: "Bungalow", value: "bungalow" },
    { label: "Room", value: "room" },
    { label: "Parking Space", value: "parking" },
    { label: "Local", value: "shop" },
    { label: "Industrial Warehouse", value: "industrial" },
    { label: "Office", value: "office" },
    { label: "Land", value: "land" },
    { label: "Storage Room", value: "storage" },
    { label: "Building", value: "building" },
    { label: "Attic", value: "penthouse" },
    { label: "Duplex", value: "duplex" },
    { label: "Study", value: "studio" },
  ];

  const floorOptions = [
    { label: "Basement 3", value: "-3" },
    { label: "Basement 2", value: "-2" },
    { label: "Basement 1", value: "-1" },
    { label: "Low", value: "0" },
    { label: "Mezzanine", value: "mezzanine" },
    { label: "Semi-basement", value: "semi-basement" },
    // Generate numbers 1 to 99
    ...Array.from({ length: 99 }, (_, i) => ({
      label: (i + 1).toString(),
      value: (i + 1).toString(),
    })),
  ];

  useEffect(() => {
    dispatch(get_tags());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch]);

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
    if (formData.reference.trim() === "")
      return toast.error("reference is required");
    if (formData.street.trim() === "") return toast.error("street is required");

    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null) {
        // 1. Check if the value is an array (like your labels)
        if (Array.isArray(formData[key])) {
          // 2. Loop through the array and append each item using the same key
          formData[key].forEach((item) => {
            data.append(key, item);
          });
        } else {
          // 3. Handle regular strings, numbers, or files normally
          data.append(key, formData[key]);
        }
      }
    });

    dispatch(create_property(data));
  };

  const handleTagToggle = (tag) => {
    let updatedTags = [...formData.labels];

    if (updatedTags.includes(tag)) {
      // If tag is already selected, remove it
      updatedTags = updatedTags.filter((t) => t !== tag);
    } else {
      // Otherwise, add it
      updatedTags.push(tag);
    }

    setFormData((prev) => ({ ...prev, labels: updatedTags }));
  };

  const fullAddress = `${formData.street} ${formData.street_number}, ${formData.city}, ${formData.province}`;

  return (
    <div className="w-full bg-white min-h-screen pb-24">
      <form onSubmit={handleSubmit} className="space-y-10">
        {/* SECTION 1: LOCATION DETAILS */}
        <section className="p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-6 border-b pb-2">
            Location Details
          </h2>
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Left Column (Inputs) */}
            <div className="w-full lg:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
              <Input
                label="Province"
                name="province"
                value={formData.province}
                onChange={handleChange}
              />
              <Input
                label="Postal Code"
                name="postal_code"
                value={formData.postal_code}
                onChange={handleChange}
              />
              <div className="md:col-span-2">
                <Input
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>
              <Input
                label="Street"
                name="street"
                value={formData.street}
                onChange={handleChange}
                required
              />
              <Input
                label="Street Number"
                name="street_number"
                value={formData.street_number}
                onChange={handleChange}
              />
              <div className="md:col-span-2">
                <Dropdown
                  label="Public Address"
                  name="public_address"
                  title="Select Option"
                  value={formData.public_address}
                  onChange={handleChange}
                  options={[
                    { label: "See all", value: "See all" },
                    {
                      label: "Hide street number",
                      value: "Hide street number",
                    },
                    { label: "Hide street", value: "Hide street" },
                    { label: "Hide everything", value: "Hide everything" },
                  ]}
                />
              </div>
              <Input
                label="District"
                name="district"
                value={formData.district}
                onChange={handleChange}
              />
              <Dropdown
                label="Zone"
                name="area"
                title="Select Zone/Area"
                value={formData.area}
                onChange={handleChange}
                options={areaOptions}
              />
            </div>
            {/* Right Column (Map) */}
            <div className="w-full lg:w-1/2">
              <AddressMiniMap address={fullAddress} />
              <p className="text-xs text-blue-600 mt-2 text-right cursor-pointer">
                Click here to manually adjust location
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 2: PROPERTY FEATURES */}
        <section className="p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-6 border-b pb-2">
            Property Features
          </h2>
          <div className="flex flex-col lg:flex-row gap-10">
            {/* LEFT COLUMN */}
            <div className="w-full lg:w-1/2 grid grid-cols-2 gap-x-4 gap-y-4">
              <div className="col-span-2">
                <Dropdown
                  label="Status" // Represents "State" in the image
                  name="status"
                  title="Select Status"
                  value={formData.status}
                  onChange={handleChange}
                  options={[
                    { label: "Prospectus", value: "prospectus" },
                    { label: "Available", value: "available" },
                    { label: "Reserved", value: "reserved" },
                    { label: "Rented", value: "rented" },
                    { label: "Sold", value: "sold" },
                    { label: "Inactive", value: "inactive" },
                  ]}
                />
              </div>

              <div className="col-span-2">
                <Input
                  label="Reference"
                  name="reference"
                  value={formData.reference}
                  onChange={handleChange}
                  required
                />
              </div>

              <Dropdown
                label="Type"
                name="type"
                title="Select Type"
                value={formData.type}
                onChange={handleChange}
                options={typeOptions}
              />
              <Dropdown
                label="Floor"
                name="floor"
                title="Select Floor"
                value={formData.floor}
                onChange={handleChange}
                options={floorOptions}
              />

              <Dropdown
                label="Rooms"
                name="rooms"
                title="Select number of rooms"
                value={formData.rooms}
                onChange={handleChange}
                options={Array.from({ length: 31 }, (_, i) => ({
                  label: i.toString(),
                  value: i.toString(),
                }))}
              />
              <Dropdown
                label="Bathrooms"
                name="bathrooms"
                title="Select number of bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                options={Array.from({ length: 31 }, (_, i) => ({
                  label: i.toString(),
                  value: i.toString(),
                }))}
              />

              <Input
                label="Surface m²"
                type="number"
                name="surface"
                value={formData.surface}
                onChange={handleChange}
              />
              <Input
                label="Usable Surface m²"
                type="number"
                name="usable_surface"
                value={formData.usable_surface}
                onChange={handleChange}
              />

              <Input
                label="Year of Construction"
                type="number"
                name="year_of_construction"
                value={formData.year_of_construction}
                onChange={handleChange}
              />
              <Input
                label="Community Expenses"
                type="number"
                name="community_expenses"
                value={formData.community_expenses}
                onChange={handleChange}
              />
              <Dropdown
                label="Energy Type"
                name="energy_certificate_type"
                title="Select energy certificate type"
                value={formData.energy_certificate_type}
                onChange={handleChange}
                options={[
                  { label: "A", value: "A" },
                  { label: "B", value: "B" },
                  { label: "C", value: "C" },
                  { label: "D", value: "D" },
                  { label: "E", value: "E" },
                  { label: "F", value: "F" },
                  { label: "G", value: "G" },
                  { label: "Not specified", value: "not_specified" },
                  { label: "In process", value: "pending" },
                  { label: "Exempt", value: "exempt" },
                ]}
              />
              <Dropdown
                label="Emission Type"
                name="emission_certificate_type"
                title="Select emission certificate type"
                value={formData.emission_certificate_type}
                onChange={handleChange}
                options={[
                  { label: "A", value: "A" },
                  { label: "B", value: "B" },
                  { label: "C", value: "C" },
                  { label: "D", value: "D" },
                  { label: "E", value: "E" },
                  { label: "F", value: "F" },
                  { label: "G", value: "G" },
                  { label: "Not specified", value: "not_specified" },
                  { label: "In process", value: "pending" },
                  { label: "Exempt", value: "exempt" },
                ]}
              />
              <Input
                label="Consumption kWh/m²"
                type="number"
                name="energy_consumption"
                value={formData.energy_consumption}
                onChange={handleChange}
              />
              <Input
                label="CO2 Emission kg/m²"
                type="number"
                name="co2_emissions"
                value={formData.co2_emissions}
                onChange={handleChange}
              />
            </div>

            {/* RIGHT COLUMN */}
            <div className="w-full lg:w-1/2 flex flex-col gap-y-6">
              <div className="flex flex-col gap-2 w-full">
                <label className="text-sm font-medium text-gray-700">
                  Labels / Tags
                </label>

                {/* Top "Big Box": Displays the selected tags */}
                <div className="min-h-[100px] w-full border border-gray-300 rounded-md p-3 flex flex-wrap content-start gap-2 bg-white">
                  {formData.labels && formData.labels.length > 0 ? (
                    formData.labels.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-green-100 text-green-800 px-3 py-1 rounded-md text-sm flex items-center gap-2"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleTagToggle(tag)}
                          className="text-green-500 hover:text-green-800 font-bold leading-none"
                        >
                          &times;
                        </button>
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400 text-sm">
                      Select tags from below...
                    </span>
                  )}
                </div>

                {/* Bottom Box: Displays all available tags to choose from */}
                <div className="w-full border border-gray-200 bg-gray-50 rounded-md p-3 flex flex-wrap gap-2">
                  <span className="text-xs text-gray-500 w-full mb-1 block">
                    Available Tags:
                  </span>
                  {tags.map((tag, index) => {
                    const isSelected = formData.labels.includes(tag.name);
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleTagToggle(tag.name)}
                        className={`px-3 py-1 text-sm rounded-md border transition-colors ${
                          isSelected
                            ? "bg-green-500 text-white border-green-500" // Styling for selected tags
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100" // Styling for unselected tags
                        }`}
                      >
                        {tag.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <Input
                  label="Property Title"
                  name="title"
                  placeholder="Enter property title"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div className="flex-1 mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="10"
                  className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-green-500 outline-none"
                />
              </div>
              <div>
                <Input
                  label="Link to video"
                  name="video_link"
                  placeholder="e.g. https://example.com/video"
                  value={formData.video_link}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: PRIVATE DATA (ADDED) */}
        <section className="p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-6 border-b pb-2">
            Private Data
          </h2>
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="w-full lg:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Owner 1"
                name="owner_1"
                placeholder="Enter owner 1"
                value={formData.owner_1}
                onChange={handleChange}
              />
              <Input
                label="Owner 2"
                name="owner_2"
                placeholder="Enter owner 2"
                value={formData.owner_2}
                onChange={handleChange}
              />
              <Input
                label="Owner 3"
                name="owner_3"
                placeholder="Enter owner 3"
                value={formData.owner_3}
                onChange={handleChange}
              />
              <Input
                label="Capturer"
                name="capturer"
                placeholder="Enter capturer"
                value={formData.capturer}
                onChange={handleChange}
              />
              <Input
                label="Commercial Manager"
                name="commercial_manager"
                placeholder="Enter commercial manager"
                value={formData.commercial_manager}
                onChange={handleChange}
              />
            </div>
            <div className="w-full lg:w-1/2"></div>
          </div>
        </section>

        {/* SECTION 4: PRIVATE DATA (ADDED) */}
        <section className="p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-6 border-b pb-2">
            Agreement (optional)
          </h2>
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="w-full lg:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Type of aggreement"
                name="agreement_type"
                placeholder="E"
                value={formData.owner_1}
                onChange={handleChange}
              />
              <Input
                label="Agreement valid from"
                name="agreement_valid_from"
                placeholder="Enter Date"
                value={formData.owner_2}
                onChange={handleChange}
              />
              <Input
                label="Agreement valid until"
                name="agreement_valid_until"
                placeholder="Enter Date"
                value={formData.owner_3}
                onChange={handleChange}
              />
              <Input
                label="Commision percentage"
                name="commission_percentage"
                placeholder="Enter commission percentage"
                value={formData.commission_percentage}
                onChange={handleChange}
              />
              <Input
                label="Commision value"
                name="commission_value"
                placeholder="Enter commission value"
                value={formData.commission_value}
                onChange={handleChange}
              />
            </div>
            <div className="w-full lg:w-1/2"></div>
          </div>
        </section>

        <div className="flex flex-col items-center justify-center">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-24 py-2 rounded font-bold transition-all"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProperty;
