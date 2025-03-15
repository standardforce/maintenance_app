'use client';
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form";
import * as z from "zod";
import { motion } from 'framer-motion';
import { UserIcon, LockIcon, BuildingIcon,LogOutIcon} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
const formSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    companyName: z.string().min(1, "Company Name is required"),
});

export default function SystemAdmin() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);
    
    const handleLogout=async()=>{
        try{
            const response=await fetch('/api/logout',{
                method:"POST",
                credentials:"include",
            });

            if(response.ok){
                router.push('/');
            }
            else{
                console.error('Logout failed');
            }
        }
        catch(error){
            console.error('Error Logging out:',error)
        }
    }

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch("/api/auth/verify-token", {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.payload.role !== "system_admin") {
                        router.push('/dashboard');
                    } else {
                        setLoading(false);
                    }
                }
            } catch (error) {
                console.error('Authentication failed');
                router.push('/');
            }
        };
        checkAuth();
    }, [router]);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
            companyName: "",
        },
    });

    const onSubmit = async (values) => {
        try {
            setErrorMessage("");

            const response = await fetch("/api/system-admin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(values),
            });

            if (response.ok) {
                form.reset();
            } else {
                const data = await response.json();
                setErrorMessage(data.message || "Failed to add admin.");
            }
        } catch (error) {
            console.error("Error adding admin:", error);
            setErrorMessage("An error occurred. Please try again.");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <motion.div className="max-w-4xl mx-auto p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">System Admin Dashboard</h1>
                <Button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 flex items-center">
                    <LogOutIcon className="h-5 w-5 mr-2" />
                    Logout
                </Button>
            </div>

            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, ease: "easeOut" }}>
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-lg md:text-xl">Add Company Admin</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {errorMessage && <p className="text-red-600 text-sm text-center">{errorMessage}</p>}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    { name: "username", label: "Username", icon: UserIcon },
                                    { name: "password", label: "Password", icon: LockIcon },
                                    { name: "companyName", label: "Company Name", icon: BuildingIcon },
                                ].map(({ name, label, icon: Icon }, index) => (
                                    <motion.div key={index} initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4, delay: index * 0.1 }}>
                                        <div className="relative">
                                            <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
                                                {label}
                                            </label>
                                            <Icon className="absolute left-2 top-10 h-4 w-4 text-gray-400" />
                                            <Input id={name} className="pl-8" {...form.register(name)} />
                                        </div>
                                        <p className="text-red-600 text-sm mt-1">{form.formState.errors[name]?.message}</p>
                                    </motion.div>
                                ))}
                            </div>

                            <motion.button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                Add Company Admin
                            </motion.button>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
}
