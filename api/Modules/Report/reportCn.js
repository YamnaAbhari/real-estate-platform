import { catchAsync } from "vanta-api";
import Property from "../Property/propertyMd.js";
import Inquiry from "../Inquiry/inquiryMd.js";
import User from "../User/userMd.js";


// Get seller dashboard statistics including properties, inquiries, and views
export const getSellerDashboard = catchAsync(async (req, res, next) => {
  const sellerId = req.user._id;

  const totalProperties = await Property.countDocuments({ sellerId });
  const activeListings = await Property.countDocuments({
    sellerId,
    status: "available",
  });
  const soldProperties = await Property.countDocuments({
    sellerId,
    status: "sold",
  });
  const rentedProperties = await Property.countDocuments({
    sellerId,
    status: "rented",
  });
  const totalInquiries = await Inquiry.countDocuments({ sellerId });
  const viewsData = await Property.aggregate([
    {
      $match: { sellerId },
    },
    {
      $group: { _id: null, totalViews: { $sum: "$views" } },
    },
  ]);
  const totalViews = viewsData.length > 0 ? viewsData[0].totalViews : 0;

  return res.status(200).json({
    success: true,
    data: {
      totalProperties,
      activeListings,
      soldProperties,
      rentedProperties,
      totalInquiries,
      totalViews,
    },
  });
});

// Get property counts grouped by property type
export const getPropertyTypeCounts = catchAsync(async (req, res, next) => {
  const counts = await Property.aggregate([
    {
      $match: {
        status: "available",
      },
    },
    {
      $group: { _id: "$propertyType", count: { $sum: 1 } },
    },
  ]);

  const formattedCounts = counts.reduce((acc, curr) => {
    acc[curr._id] = curr.count;
    return acc;
  },{});

  res.status(200).json({
    success: true,
    data: formattedCounts,
  });
});

// Get dashboard statistics (users and properties counts)
export const getDashboardState=catchAsync(async(req,res,next)=>{
  const totalUsers=await User.countDocuments()
  const totalProperties=await Property.countDocuments()
  const availableProperties=await Property.countDocuments({
    status:'available'
  }) 
  const soldProperties=await Property.countDocuments({
    status:'sold'
  }) 
  const rentedProperties=await Property.countDocuments({
    status:'rented'
  }) 

    const viewsData = await Property.aggregate([
    {
      $group: { _id: null, totalViews: { $sum: "$views" } },
    },
  ]);
  const totalViews = viewsData.length > 0 ? viewsData[0].totalViews : 0;

  return res.status(200).json({
    success:true,
    data:{
      totalUsers,
      totalViews,
      totalProperties,
      availableProperties,
      soldProperties,
      rentedProperties
    }
  })
})