"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { create_property, get_tags, messageClear } from "@/store/estate";
import toast from "react-hot-toast";
import Dropdown from "@/components/ui/DropDown";
import Input from "@/components/ui/Input";
import AddressMiniMap from "@/components/Map";
import Datepicker from "../ui/Datepicker";
import { format } from "date-fns";
import { APIProvider, useMapsLibrary } from "@vis.gl/react-google-maps";

const date = format(new Date(), "yyyy-MM-dd");

// --- NEW SUB-COMPONENT: Autocomplete Input Wrapper ---
const PlaceAutocompleteInput = ({
  value,
  onChange,
  onPlaceSelect,
  name,
  placeholder,
  className,
}) => {
  const placesLib = useMapsLibrary("places");
  const [suggestions, setSuggestions] = useState([]);
  const [sessionToken, setSessionToken] = useState(null);

  useEffect(() => {
    if (!placesLib) return;
    setSessionToken(new placesLib.AutocompleteSessionToken());
  }, [placesLib]);

  const handleInputChange = async (e) => {
    onChange(e); // Keep the form state synced with keystrokes

    const val = e.target.value;
    if (!val || !placesLib || !sessionToken) {
      setSuggestions([]);
      return;
    }

    try {
      const { suggestions } =
        await placesLib.AutocompleteSuggestion.fetchAutocompleteSuggestions({
          input: val,
          sessionToken: sessionToken,
        });
      setSuggestions(suggestions);
    } catch (error) {
      console.error("Autocomplete error:", error);
    }
  };

  const handleSelect = async (prediction) => {
    if (!placesLib) return;
    const place = new placesLib.Place({ id: prediction.placeId });

    // Request addressComponents to auto-fill the rest of the form!
    await place.fetchFields({
      fields: [
        "displayName",
        "formattedAddress",
        "location",
        "addressComponents",
      ],
    });

    setSuggestions([]);

    // Update the input field text
    onChange({
      target: { name, value: place.formattedAddress || place.displayName },
    });

    // Pass full data up to parent
    if (onPlaceSelect) onPlaceSelect(place);

    setSessionToken(new placesLib.AutocompleteSessionToken());
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        autoComplete="off"
        className={
          className ||
          "w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
        }
      />

      {suggestions.length > 0 && (
        <ul className="absolute z-[100] w-full bg-white mt-1 rounded-md shadow-xl border border-gray-200 max-h-60 overflow-y-auto">
          {suggestions.map((s, index) => {
            const p = s.placePrediction;
            if (!p) return null;
            return (
              <li
                key={p.placeId || index}
                onClick={() => handleSelect(p)}
                className="p-3 cursor-pointer hover:bg-green-50 border-b border-gray-100 last:border-none text-sm transition-colors"
              >
                <span className="font-semibold block text-gray-800">
                  {p.structuredFormat?.mainText?.text || p.text?.text}
                </span>
                <span className="text-xs text-gray-500">
                  {p.structuredFormat?.secondaryText?.text}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
// --- END SUB-COMPONENT ---

const CreateProperty = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { loader, successMessage, errorMessage, successTag, tags } =
    useSelector((state) => state.estate);

  const [mapCoords, setMapCoords] = useState(null);
  const [formData, setFormData] = useState({
    full_address: "",
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
    property_title: "",
    description: "",
    labels: [],
    owner_1: "",
    owner_2: "",
    owner_3: "",
    capturer: "",
    commercial_manager: "",
    video_link: "",
    agreement_type: "",
    agreement_valid_from: "",
    agreement_valid_until: "",
    commission_percentage: "",
    commission_value: "",
    shared_commission_percentage: "",
    is_for_rent: false,
    rent_price: "",
    is_for_sale: false,
    sale_price: "",
    show_price: true,
    cadastral_reference: "",
    keychain_reference: "",
    supplier_reference: "",
    short_description: "",
    registration_surface: "",
    terrace_surface: "",
    garage_surface: "",
    garage_space_price: "",
    rent_price: "",
    payment_frequency: "",
    bail: "",
    guarantee: "",
    real_estate_fee: "",
    rental_price_reference_index: "",
    urbanization: "",
    block: "",
    portal: "",
    gate: "",
    collaborator: "",
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
      if (successTag === "PROPERTY_CREATED") {
        router.push("/estate");
      }
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

  // --- AUTO-FILL LOGIC ---
  const handlePlaceSelected = (place) => {
    let street = "";
    let street_number = "";
    let city = "";
    let province = "";
    let postal_code = "";

    // Parse the Google Address Components
    place.addressComponents?.forEach((component) => {
      const types = component.types;
      if (types.includes("route")) street = component.longText;
      if (types.includes("street_number")) street_number = component.longText;
      if (types.includes("locality")) city = component.longText;
      if (types.includes("administrative_area_level_2"))
        province = component.longText;
      if (types.includes("postal_code")) postal_code = component.longText;
    });

    setFormData((prev) => ({
      ...prev,
      full_address: place.formattedAddress || place.displayName,
      street: street || prev.street,
      street_number: street_number || prev.street_number,
      city: city || prev.city,
      province: province || prev.province,
      postal_code: postal_code || prev.postal_code,
    }));

    // Update map coordinates
    if (place.location) {
      setMapCoords(place.location);
    }
  };

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <div className="w-full bg-white min-h-screen pb-24">
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* SECTION 1: LOCATION DETAILS */}
          <section className="p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-6 border-b pb-2">
              Location Details
            </h2>
            <div className="mb-4 rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
              {/* Header Section with subtle background */}
              <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-3">
                <p className="mt-1 text-base text-gray-600">
                  Please provide the full address, including the city, street,
                  and house number.
                </p>
              </div>

              <div className="px-6 py-4">
                <div className="w-full md:w-2/3 lg:w-1/2">
                  {/* --- REPLACED STANDARD INPUT WITH AUTOCOMPLETE --- */}
                  <PlaceAutocompleteInput
                    name="full_address"
                    placeholder="e.g. Calle de Alcalá, 1, Madrid"
                    value={formData.full_address}
                    onChange={handleChange}
                    onPlaceSelect={handlePlaceSelected}
                  />
                </div>
              </div>
            </div>
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
                  type="number"
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
                <Input
                  label="Urbanization"
                  name="urbanization"
                  value={formData.urbanization}
                  onChange={handleChange}
                />
                <div className="grid grid-cols-3 gap-4">
                  <Input
                    label="Block"
                    name="block"
                    value={formData.block}
                    onChange={handleChange}
                  />
                  <Input
                    label="Portal"
                    name="portal"
                    value={formData.portal}
                    onChange={handleChange}
                  />
                  <Input
                    label="Gate"
                    name="gate"
                    value={formData.gate}
                    onChange={handleChange}
                  />
                </div>
              </div>
              {/* Right Column (Map) */}
              <div className="w-full lg:w-1/2">
                {/* <AddressMiniMap address={formData.full_address} /> */}
                <AddressMiniMap
                  address={formData.full_address}
                  manualLocation={mapCoords}
                />
                <p className="text-xs text-green-600 mt-2 text-right cursor-pointer">
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

                {/* Checkbox Group */}
                <div className="flex flex-col gap-6 pt-6 mt-2 border-t border-gray-200 col-span-2">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                    Listing & Pricing Options
                  </h3>

                  {/* 1. RENT INTERACTIVE CARD */}
                  <div
                    className={`transition-all duration-300 rounded-xl border-2 ${formData.is_for_rent ? "border-green-500 bg-green-50/30 shadow-sm" : "border-gray-200 bg-white hover:border-gray-300"}`}
                  >
                    <div className="p-2 sm:p-3">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500 transition-colors cursor-pointer"
                          checked={formData.is_for_rent}
                          onChange={(e) =>
                            handleChange({
                              target: {
                                name: "is_for_rent",
                                value: e.target.checked,
                              },
                            })
                          }
                        />
                        <span
                          className={`text-base font-semibold ${formData.is_for_rent ? "text-green-900" : "text-gray-700 group-hover:text-gray-900"}`}
                        >
                          Rent
                        </span>
                      </label>
                    </div>

                    {/* Expanded Rent Form */}
                    {formData.is_for_rent && (
                      <div className="px-5 pb-6 border-t border-green-100 pt-5 grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5 animate-in fade-in slide-in-from-top-2">
                        <Input
                          label="Rental Price (€)"
                          name="rent_price"
                          type="number"
                          value={formData.rent_price}
                          onChange={handleChange}
                        />
                        <Dropdown
                          label="Payment Frequency"
                          name="payment_frequency"
                          title="Select Frequency"
                          value={formData.payment_frequency}
                          onChange={handleChange}
                          options={[
                            { label: "Day", value: "day" },
                            { label: "Week", value: "week" },
                            { label: "Fortnight", value: "fortnite" },
                            { label: "Month", value: "month" },
                          ]}
                        />
                        <Input
                          label="Bail (€)"
                          name="bail"
                          type="number"
                          value={formData.bail}
                          onChange={handleChange}
                        />
                        <Input
                          label="Guarantee (€)"
                          name="guarantee"
                          type="number"
                          value={formData.guarantee}
                          onChange={handleChange}
                        />
                        <Input
                          label="Real Estate Fee"
                          name="real_estate_fee"
                          type="number"
                          value={formData.real_estate_fee}
                          onChange={handleChange}
                        />
                        <Input
                          label="Price Reference Index"
                          name="rental_price_reference_index"
                          type="number"
                          value={formData.rental_price_reference_index}
                          onChange={handleChange}
                        />
                      </div>
                    )}
                  </div>

                  {/* 2. SALE INTERACTIVE CARD */}
                  <div
                    className={`transition-all duration-300 rounded-xl border-2 ${formData.is_for_sale ? "border-green-500 bg-green-50/30 shadow-sm" : "border-gray-200 bg-white hover:border-gray-300"}`}
                  >
                    <div className="p-2 sm:p-3">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500 transition-colors cursor-pointer"
                          checked={formData.is_for_sale}
                          onChange={(e) =>
                            handleChange({
                              target: {
                                name: "is_for_sale",
                                value: e.target.checked,
                              },
                            })
                          }
                        />
                        <span
                          className={`text-base font-semibold ${formData.is_for_sale ? "text-green-900" : "text-gray-700 group-hover:text-gray-900"}`}
                        >
                          Sale
                        </span>
                      </label>
                    </div>

                    {/* Expanded Sale Form */}
                    {formData.is_for_sale && (
                      <div className="px-5 pb-6 border-t border-green-100 pt-5 animate-in fade-in slide-in-from-top-2">
                        <Input
                          label="Total Sale Price (€)"
                          name="sale_price"
                          type="number"
                          value={formData.sale_price}
                          onChange={handleChange}
                        />
                      </div>
                    )}
                  </div>

                  {/* 3. SHOW PRICE TOGGLE */}
                  <div className="pt-2">
                    <label className="flex items-center gap-3 cursor-pointer group w-max">
                      <input
                        type="checkbox"
                        className="w-5 h-5 rounded border-gray-300 text-gray-800 focus:ring-gray-800 transition-colors cursor-pointer"
                        checked={formData.show_price}
                        onChange={(e) =>
                          handleChange({
                            target: {
                              name: "show_price",
                              value: e.target.checked,
                            },
                          })
                        }
                      />
                      <span className="text-base font-medium text-gray-700 group-hover:text-gray-900">
                        Show Price
                      </span>
                    </label>
                  </div>
                </div>

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
                    name="property_title"
                    placeholder="Enter property title"
                    value={formData.property_title}
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
              <div className="w-full lg:w-1/2 grid grid-cols-1 md:grid-cols-1 gap-4">
                <Input
                  label="Cadastral Reference"
                  name="cadastral_reference"
                  placeholder="Enter cadastral reference"
                  value={formData.cadastral_reference}
                  onChange={handleChange}
                />
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
              </div>
              <div className="w-full lg:w-1/2 grid grid-cols-1 md:grid-cols-1 gap-4">
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
                <Input
                  label="Collaborator"
                  name="collaborator"
                  placeholder="Enter collaborator"
                  value={formData.collaborator}
                  onChange={handleChange}
                />
                <Input
                  label="Keychain Reference"
                  name="keychain_reference"
                  placeholder="Enter keychain reference"
                  value={formData.keychain_reference}
                  onChange={handleChange}
                />
                <Input
                  label="Supplier Reference"
                  name="supplier_reference"
                  placeholder="Enter supplier reference"
                  value={formData.supplier_reference}
                  onChange={handleChange}
                />
              </div>
            </div>
          </section>

          {/* SECTION 5: AGREEMENT (OPTIONAL) */}
          <section className="p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-6 border-b pb-2">
              Agreement (optional)
            </h2>
            <div className="flex flex-col lg:flex-row gap-10">
              <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-4">
                <Dropdown
                  label="Type of aggreement"
                  name="agreement_type"
                  title="Select agreement type"
                  value={formData.agreement_type}
                  onChange={handleChange}
                  options={[
                    { label: "Exclusive", value: "exclusive" },
                    { label: "Free competition", value: "free_competition" },
                    {
                      label: "Collaboration with owner",
                      value: "collaboration_with_owner",
                    },
                    { label: "Order note", value: "order_note" },
                  ]}
                />
                <Datepicker
                  label="Agreement valid from"
                  name="agreement_valid_from"
                  value={formData.agreement_valid_from}
                  onChange={handleChange}
                  dateFormat="dd/MM/yyyy"
                  className="text-light text-sm appearance-none font-normal w-full px-2 py-3 border border-gray-400 rounded-md pr-10 rounded-radius focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <Datepicker
                  label="Agreement valid until"
                  name="agreement_valid_until"
                  value={formData.agreement_valid_until}
                  onChange={handleChange}
                  dateFormat="dd/MM/yyyy"
                  className="text-light text-sm appearance-none font-normal w-full px-2 py-3 border border-gray-400 rounded-md pr-10 rounded-radius focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <Input
                  label="Commision percentage(%)"
                  name="commission_percentage"
                  type="number"
                  placeholder="Enter commission percentage"
                  value={formData.commission_percentage}
                  onChange={handleChange}
                />
                <Input
                  label="Commision value"
                  name="commission_value"
                  type="number"
                  placeholder="Enter commission value"
                  value={formData.commission_value}
                  onChange={handleChange}
                />
                <Input
                  label="Shared Commision percentage(%)"
                  name="shared_commission_percentage"
                  type="number"
                  placeholder="Enter shared commission percentage"
                  value={formData.shared_commission_percentage}
                  onChange={handleChange}
                />
              </div>
            </div>
          </section>

          {/* SECTION 5: OTHERS (OPTIONAL) */}
          <section className="p-6">
            <h2 className="mb-6 border-b pb-2 text-lg font-bold text-gray-800">
              Others (optional)
            </h2>

            <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
              {/* Left Column: Description */}
              <div className="flex flex-col">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Short description
                </label>
                <textarea
                  name="short_description"
                  rows={8}
                  placeholder="Enter a short description..."
                  className="w-full rounded-md border border-gray-300 p-3 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  value={formData.short_description || ""}
                  onChange={handleChange}
                ></textarea>
                <p className="mt-2 text-sm text-gray-500">
                  This description will be used in the description of the
                  magazine. If left blank, the normal description will be used.
                </p>
              </div>

              {/* Right Column: Surfaces and Pricing */}
              <div className="flex flex-col space-y-5">
                {/* Registration surface */}
                <div className="relative">
                  <Input
                    label="Registration surface"
                    name="registration_surface"
                    type="number"
                    value={formData.registration_surface || ""}
                    onChange={handleChange}
                  />
                  {/* Unit suffix overlay */}
                  <div className="pointer-events-none absolute right-4 top-[36px] flex items-center text-sm text-gray-500">
                    m²
                  </div>
                </div>

                {/* Terrace surface */}
                <div className="relative">
                  <Input
                    label="Terrace surface"
                    name="terrace_surface"
                    type="number"
                    value={formData.terrace_surface || ""}
                    onChange={handleChange}
                  />
                  <div className="pointer-events-none absolute right-4 top-[36px] flex items-center text-sm text-gray-500">
                    m²
                  </div>
                </div>

                {/* Garage surface */}
                <div className="relative">
                  <Input
                    label="Garage surface"
                    name="garage_surface"
                    type="number"
                    value={formData.garage_surface || ""}
                    onChange={handleChange}
                  />
                  <div className="pointer-events-none absolute right-4 top-[36px] flex items-center text-sm text-gray-500">
                    m²
                  </div>
                </div>

                {/* Garage space price */}
                <div className="relative">
                  <Input
                    label="Garage space price"
                    name="garage_space_price"
                    type="number"
                    value={formData.garage_space_price || ""}
                    onChange={handleChange}
                  />
                  <div className="pointer-events-none absolute right-4 top-[36px] flex items-center text-sm text-gray-500">
                    €
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="sticky bottom-0 z-50 flex flex-col items-center justify-center bg-white/95 py-3 border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] w-full mt-10">
            <button
              type="submit"
              className="cursor-pointer bg-green-600 hover:bg-green-700 text-white px-30 py-2 rounded-lg font-bold text-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </APIProvider>
  );
};

export default CreateProperty;
