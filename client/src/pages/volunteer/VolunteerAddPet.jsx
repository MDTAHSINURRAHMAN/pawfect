import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { FaUpload } from "react-icons/fa";
import { toast } from "react-toastify";

const VolunteerAddPet = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    species: "Cat",
    breed: "",
    age: "",
    gender: "Male", 
    color: "",
    weight: "",
    isSpayedNeutered: false,
    isVaccinated: false,
    healthIssues: "",
    behavioralTraits: "",
    adoptionFee: "",
    adoptionRequirements: "",
    adoptionStatus: "Available",
    location: "",
    goodWithChildren: false,
    goodWithPets: false,
    energyLevel: "Medium",
    image: "",
    description: "",
    approved: false,
    petId: Math.random().toString(36).substring(2, 12).toUpperCase() // Generate random pet ID
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/admin/pets", formData);
      navigate("/volunteer/dashboard/pets");
      // Show success toast
      toast.success("Pet added successfully! Waiting for admin approval.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error("Error adding pet:", error);
      // Show error toast
      toast.error("Error adding pet. Please try again.", {
        position: "top-right", 
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <div className="p-4 md:p-8">
      <Helmet>
        <title>Add New Pet | Volunteer Dashboard</title>
      </Helmet>

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-primary">Add New Pet</h2>
        <p className="text-gray-600 mt-2">Enter the details of the new pet</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Pet Name*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input input-bordered"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Species*</span>
            </label>
            <select 
              name="species"
              value={formData.species}
              onChange={handleChange}
              className="select select-bordered"
              required
            >
              <option value="Cat">Cat</option>
              <option value="Dog">Dog</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Breed*</span>
            </label>
            <input
              type="text"
              name="breed"
              value={formData.breed}
              onChange={handleChange}
              className="input input-bordered"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Age*</span>
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="input input-bordered"
              required
              placeholder="e.g., 2 years"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Gender*</span>
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="select select-bordered"
              required
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Color*</span>
            </label>
            <input
              type="text"
              name="color"
              value={formData.color}
              onChange={handleChange}
              className="input input-bordered"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Weight (in lbs)*</span>
            </label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              className="input input-bordered"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Location*</span>
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="input input-bordered"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Adoption Fee*</span>
            </label>
            <input
              type="number"
              name="adoptionFee"
              value={formData.adoptionFee}
              onChange={handleChange}
              className="input input-bordered"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Energy Level*</span>
            </label>
            <select
              name="energyLevel"
              value={formData.energyLevel}
              onChange={handleChange}
              className="select select-bordered"
              required
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Image URL*</span>
            </label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="input input-bordered"
              required
            />
          </div>
        </div>

        {/* Health Information */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-primary">Health Information</h3>
          <div className="flex flex-wrap gap-6">
            <label className="label cursor-pointer">
              <input
                type="checkbox"
                name="isSpayedNeutered"
                checked={formData.isSpayedNeutered}
                onChange={handleChange}
                className="checkbox checkbox-primary mr-2"
              />
              <span className="label-text">Spayed/Neutered</span>
            </label>

            <label className="label cursor-pointer">
              <input
                type="checkbox"
                name="isVaccinated"
                checked={formData.isVaccinated}
                onChange={handleChange}
                className="checkbox checkbox-primary mr-2"
              />
              <span className="label-text">Vaccinated</span>
            </label>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Health Issues</span>
            </label>
            <textarea
              name="healthIssues"
              value={formData.healthIssues}
              onChange={handleChange}
              className="textarea textarea-bordered h-24"
            ></textarea>
          </div>
        </div>

        {/* Behavioral Information */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-primary">Behavioral Information</h3>
          <div className="flex flex-wrap gap-6">
            <label className="label cursor-pointer">
              <input
                type="checkbox"
                name="goodWithChildren"
                checked={formData.goodWithChildren}
                onChange={handleChange}
                className="checkbox checkbox-primary mr-2"
              />
              <span className="label-text">Good with Children</span>
            </label>

            <label className="label cursor-pointer">
              <input
                type="checkbox"
                name="goodWithPets"
                checked={formData.goodWithPets}
                onChange={handleChange}
                className="checkbox checkbox-primary mr-2"
              />
              <span className="label-text">Good with Other Pets</span>
            </label>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Behavioral Traits</span>
            </label>
            <textarea
              name="behavioralTraits"
              value={formData.behavioralTraits}
              onChange={handleChange}
              className="textarea textarea-bordered h-24"
            ></textarea>
          </div>
        </div>

        {/* Additional Information */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-primary">Additional Information</h3>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Description*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="textarea textarea-bordered h-24"
              required
            ></textarea>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Adoption Requirements*</span>
            </label>
            <textarea
              name="adoptionRequirements"
              value={formData.adoptionRequirements}
              onChange={handleChange}
              className="textarea textarea-bordered h-24"
              required
            ></textarea>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/volunteer/dashboard/pets")}
            className="btn btn-ghost"
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Add Pet
          </button>
        </div>
      </form>
    </div>
  );
};

export default VolunteerAddPet;
