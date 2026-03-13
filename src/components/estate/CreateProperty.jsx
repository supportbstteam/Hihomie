"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { create_property, messageClear } from "@/store/estate";
import toast from "react-hot-toast";
import Dropdown from "@/components/ui/DropDown";
import Input from "@/components/ui/Input";

const CreateProperty = () => {
  const dispatch = useDispatch();
  const { loader, successMessage, errorMessage } = useSelector(
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
    labels: "",
    owner_1: "",
    owner_2: "",
    owner_3: "",
    capturer: "",
    commercial_manager: "",
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
        data.append(key, formData[key]);
      }
    });
    dispatch(create_property(data));
  };

  const labelStyle = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      <form onSubmit={handleSubmit} className="p-0">
        {/* BLOCK 1: Location Details */}
        <div className="bg-white border-b border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Location Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
            <Input
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
            <Input
              label="District"
              name="district"
              value={formData.district}
              onChange={handleChange}
            />

            <Dropdown
              label="Area"
              name="area"
              title="Select Area"
              options={areaOptions}
              value={formData.area}
              onChange={handleChange}
            />

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
            <Dropdown
              label="Public Address"
              name="public_address"
              title="Select Option"
              options={[
                { label: "See all", value: "See all" },
                { label: "Hide street number", value: "Hide street number" },
                { label: "Hide street", value: "Hide street" },
                { label: "Hide everything", value: "Hide everything" },
              ]}
              value={formData.public_address}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* BLOCK 2: Property Features */}
        <div className="bg-white p-8 mt-4 border-t border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Property Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <Dropdown
              label="Status"
              name="status"
              title="Select Status"
              options={[
                { label: "Prospectus", value: "prospectus" },
                { label: "Available", value: "available" },
                { label: "Reserved", value: "reserved" },
                { label: "Rented", value: "rented" },
                { label: "Sold", value: "sold" },
                { label: "Inactive", value: "inactive" },
              ]}
              value={formData.status}
              onChange={handleChange}
            />
            <Input
              label="Reference"
              name="reference"
              value={formData.reference}
              onChange={handleChange}
              required
            />
            <Dropdown
              label="Type"
              name="type"
              title="Select Type"
              options={typeOptions}
              value={formData.type}
              onChange={handleChange}
            />
            <Dropdown
              label="Floor"
              name="floor"
              title="Select Floor"
              options={floorOptions}
              value={formData.floor}
              onChange={handleChange}
            />
            <Dropdown
              label="Rooms"
              name="rooms"
              title="Select rooms"
              options={Array.from({ length: 31 }, (_, i) => ({
                label: i.toString(),
                value: i.toString(),
              }))}
              value={formData.rooms}
              onChange={handleChange}
            />
            <Dropdown
              label="Bathrooms"
              name="bathrooms"
              title="Select Bathrooms"
              options={Array.from({ length: 31 }, (_, i) => ({
                label: i.toString(),
                value: i.toString(),
              }))}
              value={formData.rooms}
              onChange={handleChange}
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

            <div className="md:col-span-3 lg:col-span-5">
              <label className={labelStyle}>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full border border-gray-400 rounded-md p-2 focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                placeholder="Describe the property highlights..."
              />
            </div>
            <div className="md:col-span-3 lg:col-span-5">
              <Input
                label="Labels / Tags"
                name="labels"
                value={formData.labels}
                onChange={handleChange}
                placeholder="e.g. Luxury, Sea View, Investment (comma separated)"
              />
            </div>
          </div>

          {/* Transaction Type & Toggle */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap items-center gap-10">
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer font-medium">
                <input
                  type="radio"
                  name="transaction_type"
                  value="sale"
                  checked={formData.transaction_type === "sale"}
                  onChange={handleChange}
                  className="w-4 h-4 text-green-600"
                />{" "}
                Sale
              </label>
              <label className="flex items-center gap-2 cursor-pointer font-medium">
                <input
                  type="radio"
                  name="transaction_type"
                  value="rent"
                  checked={formData.transaction_type === "rent"}
                  onChange={handleChange}
                  className="w-4 h-4 text-green-600"
                />{" "}
                Rent
              </label>
            </div>
            <label className="flex items-center gap-2 cursor-pointer font-medium bg-gray-100 px-4 py-2 rounded-lg">
              <input
                type="checkbox"
                name="show_price_tags"
                checked={formData.show_price_tags}
                onChange={handleChange}
                className="w-4 h-4 rounded border-gray-300"
              />
              Show Price Tags
            </label>
          </div>

          {/* Energy Section */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-green-50 p-6 rounded-xl border border-green-100">
            <div>
              <Dropdown
                label="Energy Certificate Type"
                name="energy_certificate_type"
                title="Select energy certificate type"
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
                value={formData.energy_certificate_type}
                onChange={handleChange}
              />
              {/* <label className={labelStyle}>Energy Certificate</label>
              <input
                type="file"
                name="energy_certificate"
                onChange={handleChange}
                className="text-sm block w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-600 file:text-white hover:file:bg-green-700"
              /> */}
            </div>
            <div>
              <Dropdown
                label="Emission Certificate Type"
                name="emission_certificate_type"
                title="Select emission certificate type"
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
                value={formData.emission_certificate_type}
                onChange={handleChange}
              />
              {/* <label className={labelStyle}>Emission Certificate</label>
              <input
                type="file"
                name="emission_certificate"
                onChange={handleChange}
                className="text-sm block w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-600 file:text-white hover:file:bg-green-700"
              /> */}
            </div>
            <Input
              label="Energy Consumption kWh/m²"
              type="number"
              name="energy_consumption"
              value={formData.energy_consumption}
              onChange={handleChange}
            />
            <Input
              label="CO2 Emission kgCO₂/m²"
              type="number"
              name="co2_emissions"
              value={formData.co2_emissions}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="bg-white p-8 mt-4 border-t border-b border-gray-200">
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Private Data</h2>
            <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded">
              (Optional)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Dropdown
              label="First Owner"
              name="owner_1"
              title="Search/Select Owner"
              options={[]} // This would be populated by your API search
              value={formData.owner_1}
              onChange={handleChange}
            />
            <Dropdown
              label="Second Owner"
              name="owner_2"
              title="Search/Select Owner"
              options={[]}
              value={formData.owner_2}
              onChange={handleChange}
            />
            <Dropdown
              label="Third Owner"
              name="owner_3"
              title="Search/Select Owner"
              options={[]}
              value={formData.owner_3}
              onChange={handleChange}
            />
            <Dropdown
              label="Capturer"
              name="capturer"
              title="Search/Select Capturer"
              options={[]}
              value={formData.capturer}
              onChange={handleChange}
            />
            <Dropdown
              label="Commercial Manager"
              name="commercial_manager"
              title="Search/Select Manager"
              options={[]}
              value={formData.commercial_manager}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="p-8">
          <button
            disabled={loader}
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white text-lg font-bold py-2 px-6 rounded-lg shadow-lg transition-all transform active:scale-95 disabled:bg-gray-400"
          >
            {loader ? "Saving..." : "Save Property Listing"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProperty;
