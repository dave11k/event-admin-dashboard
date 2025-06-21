"use client";

import { Mail, Calendar, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { User } from "./users-management";

interface UsersCardsProps {
  users: User[];
}

const statusColors = {
  upcoming: "bg-blue-100 text-blue-800 border-blue-200",
  ongoing: "bg-orange-100 text-orange-800 border-orange-200",
  completed: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
} as const;

export function UsersCards({ users }: UsersCardsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="grid gap-4">
      {users.map((user) => (
        <Card
          key={user.id}
          className="shadow-sm hover:shadow-md transition-shadow"
        >
          <CardContent className="p-4">
            <div className="flex items-start space-x-4">
              {/* Avatar */}
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-medium">
                  {getInitials(user.name)}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900 truncate">
                      {user.name}
                    </h3>
                    <a
                      href={`mailto:${user.email}`}
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors text-sm"
                    >
                      <Mail className="h-3 w-3" />
                      <span className="truncate">{user.email}</span>
                    </a>
                  </div>
                  <Badge
                    className={statusColors[user.eventStatus]}
                    variant="outline"
                  >
                    {user.eventStatus.charAt(0).toUpperCase() +
                      user.eventStatus.slice(1)}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{user.eventName}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4 flex-shrink-0" />
                    <span>Registered {formatDate(user.registeredDate)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
