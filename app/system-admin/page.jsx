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
        <motion.div>
         <motion.h1 
            className="text-4xl font-extrabold text-center bg-gradient-to-r from-blue-600 to-indigo-500 text-transparent bg-clip-text dark:from-blue-400 dark:to-indigo-300 mb-8"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            Infrapulse
        </motion.h1>
        <motion.div 
        className="max-w-3xl mx-auto p-8 bg-white dark:bg-gray-900 rounded-lg shadow-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        >
        {/* Header with Logout */}
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            System Admin Dashboard
            </h1>
            <Button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 flex items-center rounded-md transition duration-200"
            >
            <LogOutIcon className="h-5 w-5 mr-2" />
            Logout
            </Button>
        </div>

        {/* Animated Form Container */}
        <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >
            <Card className="shadow-lg p-6 bg-gray-50 dark:bg-gray-800 rounded-md">
            <CardHeader className="text-center">
                <CardTitle className="text-xl font-semibold text-gray-800 dark:text-white">
                Add Company Admin
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
                {errorMessage && (
                <p className="text-red-600 text-sm text-center">
                    {errorMessage}
                </p>
                )}

                {/* Form */}
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[
                    { name: "username", label: "Username", icon: UserIcon },
                    { name: "password", label: "Password", icon: LockIcon },
                    { name: "companyName", label: "Company Name", icon: BuildingIcon },
                    ].map(({ name, label, icon: Icon }, index) => (
                    <motion.div 
                        key={index}
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                        <div className="relative">
                        <label htmlFor={name} className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                            {label}
                        </label>
                        <div className="relative">
                            <Icon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <Input
                            id={name}
                            className="pl-10 py-2 w-full border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            {...form.register(name)}
                            />
                        </div>
                        <p className="text-red-600 text-sm mt-1">
                            {form.formState.errors[name]?.message}
                        </p>
                        </div>
                    </motion.div>
                    ))}
                </div>

                {/* Submit Button */}
                <motion.button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200 shadow-md"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Add Company Admin
                </motion.button>
                </form>

                {/* Optional Illustration
                <div className="hidden md:flex justify-center mt-6">
                <img 
                    src="https://source.unsplash.com/400x250/?office,technology" 
                    alt="Illustration" 
                    className="rounded-md shadow-md"
                />
                </div> */}
            </CardContent>
            </Card>
        </motion.div>
        </motion.div>
        </motion.div>
    );
}
