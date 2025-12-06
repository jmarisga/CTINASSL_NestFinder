// Property Data for Nest Finder
// Edit this file to update property information across the site

const properties = [
  {
    id: "property-01",
    name: "Nuvali Blvd. corner Jose Yulo Blvd. (Cangolf Road), Brgy. Pittland, Cabuyao, Laguna",
    category: "Villa House",
    categoryClass: "vhs",
    price: "31,640,000",
    bedrooms: 4,
    bathrooms: 3,
    area: "328 sqm",
    floor: "3",
    parking: "3 spots",
    image: "villa-property-1.jpeg",
    description: "Get <strong>the best property finder</strong> platform for your real estate needs. Nest Finder provides you with comprehensive property listings and expert guidance. Discover your perfect home with our easy-to-use search and scheduling tools.<br><br>When you're looking for the perfect property, Nest Finder makes it easy to browse, compare, and schedule visits. Our platform helps you find exactly what you're looking for with detailed listings, professional photos, and comprehensive property information."
  },
  {
    id: "property-02",
    name: "54 New Street Florida, OR 27001",
    category: "House",
    categoryClass: "hou",
    price: "$1,180,000",
    bedrooms: 6,
    bathrooms: 5,
    area: "450m2",
    floor: "3",
    parking: "8 spots",
    image: "property-02.jpg",
    description: "Get <strong>the best property finder</strong> platform for your real estate needs. Nest Finder provides you with comprehensive property listings and expert guidance. Discover your perfect home with our easy-to-use search and scheduling tools.<br><br>When you're looking for the perfect property, Nest Finder makes it easy to browse, compare, and schedule visits. Our platform helps you find exactly what you're looking for with detailed listings, professional photos, and comprehensive property information."
  },
  {
    id: "property-03",
    name: "26 Mid Street Portland, OR 38540",
    category: "Villa House",
    categoryClass: "vhs",
    price: "$1,460,000",
    bedrooms: 5,
    bathrooms: 4,
    area: "225m2",
    floor: "3",
    parking: "10 spots",
    image: "property-03.jpg",
    description: "Get <strong>the best property finder</strong> platform for your real estate needs. Nest Finder provides you with comprehensive property listings and expert guidance. Discover your perfect home with our easy-to-use search and scheduling tools.<br><br>When you're looking for the perfect property, Nest Finder makes it easy to browse, compare, and schedule visits. Our platform helps you find exactly what you're looking for with detailed listings, professional photos, and comprehensive property information."
  },
  {
    id: "property-04",
    name: "12 Hope Street Portland, OR 12650",
    category: "Apartment",
    categoryClass: "apt",
    price: "$584,500",
    bedrooms: 4,
    bathrooms: 3,
    area: "125m2",
    floor: "25th",
    parking: "2 cars",
    image: "property-04.jpg",
    description: "Get <strong>the best property finder</strong> platform for your real estate needs. Nest Finder provides you with comprehensive property listings and expert guidance. Discover your perfect home with our easy-to-use search and scheduling tools.<br><br>When you're looking for the perfect property, Nest Finder makes it easy to browse, compare, and schedule visits. Our platform helps you find exactly what you're looking for with detailed listings, professional photos, and comprehensive property information."
  },
  {
    id: "property-05",
    name: "34 Hope Street Portland, OR 42680",
    category: "Villa House",
    categoryClass: "vhs",
    price: "$925,600",
    bedrooms: 4,
    bathrooms: 4,
    area: "180m2",
    floor: "38th",
    parking: "2 cars",
    image: "property-05.jpg",
    description: "Get <strong>the best property finder</strong> platform for your real estate needs. Nest Finder provides you with comprehensive property listings and expert guidance. Discover your perfect home with our easy-to-use search and scheduling tools.<br><br>When you're looking for the perfect property, Nest Finder makes it easy to browse, compare, and schedule visits. Our platform helps you find exactly what you're looking for with detailed listings, professional photos, and comprehensive property information."
  },
  {
    id: "property-06",
    name: "22 Hope Street Portland, OR 16540",
    category: "Apartment",
    categoryClass: "apt",
    price: "$450,000",
    bedrooms: 3,
    bathrooms: 2,
    area: "165m2",
    floor: "26th",
    parking: "3 cars",
    image: "property-06.jpg",
    description: "Get <strong>the best property finder</strong> platform for your real estate needs. Nest Finder provides you with comprehensive property listings and expert guidance. Discover your perfect home with our easy-to-use search and scheduling tools.<br><br>When you're looking for the perfect property, Nest Finder makes it easy to browse, compare, and schedule visits. Our platform helps you find exactly what you're looking for with detailed listings, professional photos, and comprehensive property information."
  },
  {
    id: "property-07",
    name: "14 Mid Street Miami, OR 36450",
    category: "Villa House",
    categoryClass: "vhs",
    price: "$980,000",
    bedrooms: 8,
    bathrooms: 8,
    area: "550m2",
    floor: "3",
    parking: "12 spots",
    image: "property-03.jpg",
    description: "Get <strong>the best property finder</strong> platform for your real estate needs. Nest Finder provides you with comprehensive property listings and expert guidance. Discover your perfect home with our easy-to-use search and scheduling tools.<br><br>When you're looking for the perfect property, Nest Finder makes it easy to browse, compare, and schedule visits. Our platform helps you find exactly what you're looking for with detailed listings, professional photos, and comprehensive property information."
  },
  {
    id: "property-08",
    name: "26 Old Street Miami, OR 12870",
    category: "House",
    categoryClass: "hou",
    price: "$1,520,000",
    bedrooms: 12,
    bathrooms: 15,
    area: "380m2",
    floor: "3",
    parking: "14 spots",
    image: "property-02.jpg",
    description: "Get <strong>the best property finder</strong> platform for your real estate needs. Nest Finder provides you with comprehensive property listings and expert guidance. Discover your perfect home with our easy-to-use search and scheduling tools.<br><br>When you're looking for the perfect property, Nest Finder makes it easy to browse, compare, and schedule visits. Our platform helps you find exactly what you're looking for with detailed listings, professional photos, and comprehensive property information."
  },
  {
    id: "property-09",
    name: "34 New Street Miami, OR 24650",
    category: "Villa House",
    categoryClass: "vhs",
    price: "$3,145,000",
    bedrooms: 10,
    bathrooms: 12,
    area: "860m2",
    floor: "3",
    parking: "10 spots",
    image: "property-01.jpg",
    description: "Get <strong>the best property finder</strong> platform for your real estate needs. Nest Finder provides you with comprehensive property listings and expert guidance. Discover your perfect home with our easy-to-use search and scheduling tools.<br><br>When you're looking for the perfect property, Nest Finder makes it easy to browse, compare, and schedule visits. Our platform helps you find exactly what you're looking for with detailed listings, professional photos, and comprehensive property information."
  }
];

// Function to get property by ID
function getPropertyById(id) {
  return properties.find(property => property.id === id);
}

// Function to get all properties
function getAllProperties() {
  return properties;
}

// Function to get properties by category
function getPropertiesByCategory(categoryClass) {
  return properties.filter(property => property.categoryClass === categoryClass);
}

// Make functions available globally
window.propertyData = {
  properties,
  getPropertyById,
  getAllProperties,
  getPropertiesByCategory
};
