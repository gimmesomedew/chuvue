"use client";

export default function UserRowSkeleton() {
  return (
    <tr className="animate-pulse">
      {/* Avatar */}
      <td>
        <div className="w-10 h-10 rounded-full bg-gray-200" />
      </td>
      {/* Name */}
      <td>
        <div className="h-4 w-24 bg-gray-200 rounded" />
      </td>
      {/* Email */}
      <td>
        <div className="h-4 w-40 bg-gray-200 rounded" />
      </td>
      {/* Role */}
      <td>
        <div className="h-4 w-16 bg-gray-200 rounded" />
      </td>
      {/* Joined */}
      <td>
        <div className="h-4 w-20 bg-gray-200 rounded" />
      </td>
      {/* Actions */}
      <td className="text-center">
        <div className="flex gap-2 justify-center">
          <div className="h-6 w-6 bg-gray-200 rounded" />
          <div className="h-6 w-6 bg-gray-200 rounded" />
        </div>
      </td>
    </tr>
  );
} 