import React from "react";
import { FaPlusSquare } from "react-icons/fa";
import { useQuery } from "react-query";
import { profileApi } from "../../apis/user/usersApi";
import StatusMessage from "../Alert/StatusMessage";
import { Link } from "react-router-dom";

const ContentGenerationHistory = () => {
  const { isLoading, isError, data, error } = useQuery({
    queryFn: profileApi,
    queryKey: ["profile"],
  });
  console.log(data.user.contentHistory);
  if (isLoading)
    return StatusMessage({
      type: "loading",
      message: "Loading please wait...",
    });
  // display error
  else if (isError) {
    return (
      (<StatusMessage type="error" message={error?.response?.data?.message} />),
      console.log(error)
    );
  }
  return (
    <div className="bg-gray-100 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-6">
          Content Generation History
        </h2>
        {/* Button to create new content - functionality to be implemented */}
        <Link
          to='/generate-content'
          className="mb-4 w-60 bg-blue-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-600 flex items-center"
        >
          <FaPlusSquare className="mr-2" /> Create New Content
        </Link>
        {/* Content history list */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {data?.user?.contentHistory?.length <= 0 ? (
            <h1>No History Found</h1>
          ) : (
            <ul className="divide-y divide-gray-200">
              {/* Static example list item */}
              {data?.user?.contentHistory?.map((item) => {
                return (
                  <li className="px-6 py-4 flex items-center justify-between space-x-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item?.content}
                      </p>
                      <p className="text-sm text-gray-500">{new Date(item?.createdAt).toDateString()}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      {/* Icons for view, edit, and delete actions - functionality to be implemented */}
                      {/* <FaEye className="text-green-500 hover:text-green-600 cursor-pointer" />
              <FaRegEdit className="text-blue-500 hover:text-blue-600 cursor-pointer" />
              <FaTrashAlt className="text-red-500 hover:text-red-600 cursor-pointer" /> */}
                    </div>
                  </li>
                );
              })}
              {/* Additional list items can be added here */}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentGenerationHistory;

//TODO implement delete,view
