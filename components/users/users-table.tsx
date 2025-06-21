"use client";

import { useState } from "react";
import { Mail, Calendar, ArrowUpDown, Search, UsersIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { User } from "./users-management";
import { Input } from "@/components/ui/input";

interface UsersTableProps {
  users: User[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  totalCount: number;
}

type SortField = "name" | "registeredDate";
type SortDirection = "asc" | "desc";

const statusColors = {
  upcoming: "bg-blue-100 text-blue-800 border-blue-200",
  ongoing: "bg-orange-100 text-orange-800 border-orange-200",
  completed: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
} as const;

export function UsersTable({
  users,
  searchQuery,
  setSearchQuery,
  totalCount,
}: UsersTableProps) {
  const [sortField, setSortField] = useState<SortField>("registeredDate");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedUsers = [...users].sort((a, b) => {
    let aValue: string | Date;
    let bValue: string | Date;

    if (sortField === "name") {
      aValue = a.name.toLowerCase();
      bValue = b.name.toLowerCase();
    } else {
      aValue = new Date(a.registeredDate);
      bValue = new Date(b.registeredDate);
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

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
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <UsersIcon className="h-5 w-5" />
            All Users ({totalCount})
          </CardTitle>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full sm:w-96"
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("name")}
                    className="h-auto p-0 font-semibold hover:bg-transparent"
                  >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="font-semibold">Email</TableHead>
                <TableHead className="font-semibold">Event Name</TableHead>
                <TableHead className="font-semibold">Event Status</TableHead>
                <TableHead className="font-semibold">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("registeredDate")}
                    className="h-auto p-0 font-semibold hover:bg-transparent"
                  >
                    Registered Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedUsers.map((user, index) => (
                <TableRow
                  key={user.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
                >
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {getInitials(user.name)}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {user.name}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <a
                      href={`mailto:${user.email}`}
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                      <span>{user.email}</span>
                    </a>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-gray-900">
                      {user.eventName}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={statusColors[user.eventStatus]}
                      variant="outline"
                    >
                      {user.eventStatus.charAt(0).toUpperCase() +
                        user.eventStatus.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">
                        {formatDate(user.registeredDate)}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
