"use client";

import UKPostcodeAutocomplete from "@/components/admin/location/SearchLocation"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

const AdminLocations = () => {
    const [selectedLoc, setSelectedLoc] = useState<any>();
    
    return (
        <div>
            <div className="flex justify-between items-center">
                <h1 className="text-lg font-bold">Location Management</h1>
                <Dialog>
                    <form>
                        <DialogTrigger asChild>
                            <Button size="sm" className="text-xs">Open Dialog</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Add a location</DialogTitle>
                                <DialogDescription>
                                    Input the location information here.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4">
                                <div className="grid gap-3">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" name="name" defaultValue="" />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="address">Address</Label>
                                    <UKPostcodeAutocomplete
                                        className="max-w-md"
                                        onPick={({ postcode, lat, lon, name }) => {
                                            setSelectedLoc({ postcode, lat, lon, name });
                                        }}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button type="submit">Save</Button>
                            </DialogFooter>
                        </DialogContent>
                    </form>
                </Dialog>
            </div>
        </div>
    )
}

export default AdminLocations;