"use client"

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { create_property, messageClear } from '@/store/estate';
import toast from 'react-hot-toast'; // Assuming you use react-hot-toast

const CreateProperty = () => {
  const dispatch = useDispatch();
  const { loader, successMessage, errorMessage } = useSelector(state => state.estate);

  const [formData, setFormData] = useState({
    province: '', postal_code: '', city: '', street: '', 
    street_number: '', public_address: '', district: '', area: '',
    state: '', reference: '', guy: '', plant: '',
    rooms: '', bathrooms: '', surface: '', usable_surface: '',
    year_of_construction: '', community_expenses: '',
    transaction_type: 'sale',
    show_price_tags: false,
    energy_consumption: '',
    co2_emissions: '',
    // File states
    energy_certificate: null,
    emission_certificate: null
  });

  // Handle Notifications
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
    
    if (type === 'file') {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.reference.trim() === "") {
      return toast.error("reference is required");
     }
    if (formData.street.trim() === "") {
      return toast.error("street is required");
     }
    
    // Create FormData object to handle files
    const data = new FormData();
    
    // Append all text/boolean fields
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null) {
        data.append(key, formData[key]);
      }
    });

    dispatch(create_property(data));
  };

  const labelStyle = "block text-sm font-medium text-gray-700 mb-1";
  const inputStyle = "w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-500 focus:outline-none transition-all";

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      <form onSubmit={handleSubmit} className="p-0">
        
        {/* BLOCK 1: Location Details */}
        <div className="bg-white border-b border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Location Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div><label className={labelStyle}>Province</label><input name="province" value={formData.province} className={inputStyle} onChange={handleChange} /></div>
            <div><label className={labelStyle}>Postal Code</label><input name="postal_code" value={formData.postal_code} className={inputStyle} onChange={handleChange} /></div>
            <div><label className={labelStyle}>City</label><input name="city" value={formData.city} className={inputStyle} onChange={handleChange} /></div>
            <div><label className={labelStyle}>District</label><input name="district" value={formData.district} className={inputStyle} onChange={handleChange} /></div>
            <div><label className={labelStyle}>Area</label><input name="area" value={formData.area} className={inputStyle} onChange={handleChange} /></div>
            <div><label className={labelStyle}>Street <span className='text-red-500'>*</span></label><input name="street" value={formData.street} className={inputStyle} onChange={handleChange} /></div>
            <div><label className={labelStyle}>Street Number</label><input name="street_number" value={formData.street_number} className={inputStyle} onChange={handleChange} /></div>
            <div><label className={labelStyle}>Public Address</label><input name="public_address" value={formData.public_address} className={inputStyle} onChange={handleChange} placeholder="Publicly visible name" /></div>
          </div>
        </div>

        {/* BLOCK 2: Property Features */}
        <div className="bg-white p-8 mt-4 border-t border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Property Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <div><label className={labelStyle}>State</label><input name="state" value={formData.state} className={inputStyle} placeholder="e.g. Excellent" onChange={handleChange} /></div>
            <div><label className={labelStyle}>Reference <span className='text-red-500'>*</span></label><input name="reference" value={formData.reference} className={inputStyle} onChange={handleChange} /></div>
            <div><label className={labelStyle}>Guy (Agent/Contact)</label><input name="guy" value={formData.guy} className={inputStyle} onChange={handleChange} /></div>
            <div><label className={labelStyle}>Plant (Floor)</label><input name="plant" value={formData.plant} className={inputStyle} onChange={handleChange} /></div>
            <div><label className={labelStyle}>Rooms</label><input type="number" name="rooms" value={formData.rooms} className={inputStyle} onChange={handleChange} /></div>
            <div><label className={labelStyle}>Bathrooms</label><input type="number" name="bathrooms" value={formData.bathrooms} className={inputStyle} onChange={handleChange} /></div>
            <div><label className={labelStyle}>Surface m²</label><input type="number" name="surface" value={formData.surface} className={inputStyle} onChange={handleChange} /></div>
            <div><label className={labelStyle}>Usable Surface m²</label><input type="number" name="usable_surface" value={formData.usable_surface} className={inputStyle} onChange={handleChange} /></div>
            <div><label className={labelStyle}>Year of Construction</label><input type="number" name="year_of_construction" value={formData.year_of_construction} className={inputStyle} onChange={handleChange} /></div>
            <div><label className={labelStyle}>Community Expenses</label><input type="number" name="community_expenses" value={formData.community_expenses} className={inputStyle} onChange={handleChange} /></div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap items-center gap-10">
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer font-medium">
                <input type="radio" name="transaction_type" value="sale" checked={formData.transaction_type === 'sale'} onChange={handleChange} className="w-4 h-4 text-green-600" /> Sale
              </label>
              <label className="flex items-center gap-2 cursor-pointer font-medium">
                <input type="radio" name="transaction_type" value="rent" checked={formData.transaction_type === 'rent'} onChange={handleChange} className="w-4 h-4 text-green-600" /> Rent
              </label>
            </div>
            <label className="flex items-center gap-2 cursor-pointer font-medium bg-gray-100 px-4 py-2 rounded-lg">
              <input type="checkbox" name="show_price_tags" checked={formData.show_price_tags} onChange={handleChange} className="w-4 h-4 rounded border-gray-300" /> 
              Show Price Tags
            </label>
          </div>

          {/* Energy Section */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-green-50 p-6 rounded-xl border border-green-100">
            <div>
              <label className={labelStyle}>Energy Certificate</label>
              <input type="file" name="energy_certificate" onChange={handleChange} className="text-sm block w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-600 file:text-white hover:file:bg-green-700" />
            </div>
            <div>
              <label className={labelStyle}>Emission Certificate</label>
              <input type="file" name="emission_certificate" onChange={handleChange} className="text-sm block w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-600 file:text-white hover:file:bg-green-700" />
            </div>
            <div><label className={labelStyle}>Cons. kWh/m²</label><input type="number" name="energy_consumption" value={formData.energy_consumption} className={inputStyle} onChange={handleChange} /></div>
            <div><label className={labelStyle}>CO2 kgCO₂/m²</label><input type="number" name="co2_emissions" value={formData.co2_emissions} className={inputStyle} onChange={handleChange} /></div>
          </div>
        </div>

        <div className="p-8">
          <button disabled={loader} type="submit" className="bg-green-600 hover:bg-green-700 text-white text-lg font-bold py-2 px-6 rounded-lg shadow-lg transition-all transform active:scale-95 disabled:bg-gray-400">
            {loader ? 'Saving...' : 'Save Property Listing'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProperty;