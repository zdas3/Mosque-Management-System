"use client";

import { useState, useEffect } from "react";
import { Upload, X, Save, Settings as SettingsIcon } from "lucide-react";

export default function AdminSettings() {
    const [settings, setSettings] = useState({
        monthlyFeeQr: "",
        contributionQr: ""
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // File states for preview
    const [files, setFiles] = useState({
        monthlyFeeQr: null,
        contributionQr: null
    });

    useEffect(() => {
        async function fetchSettings() {
            try {
                const res = await fetch("/api/settings");
                if (res.ok) {
                    const data = await res.json();
                    setSettings(prev => ({ ...prev, ...data }));
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchSettings();
    }, []);

    const handleFileChange = (key, e) => {
        if (e.target.files && e.target.files[0]) {
            setFiles(prev => ({ ...prev, [key]: e.target.files[0] }));
        }
    };

    const handleRemoveFile = (key) => {
        setFiles(prev => ({ ...prev, [key]: null }));
        setSettings(prev => ({ ...prev, [key]: "" }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Upload new files
            const newSettings = { ...settings };

            for (const key of ['monthlyFeeQr', 'contributionQr']) {
                if (files[key]) {
                    const uploadData = new FormData();
                    uploadData.append('file', files[key]);
                    uploadData.append('folder', 'qr');

                    const res = await fetch('/api/upload', {
                        method: 'POST',
                        body: uploadData
                    });

                    if (res.ok) {
                        const data = await res.json();
                        newSettings[key] = data.url;
                    } else {
                        throw new Error(`Failed to upload ${key}`);
                    }
                }
            }

            // Save to DB
            const payload = {
                settings: Object.entries(newSettings)
                    .filter(([_, value]) => value !== "") // Optional: only save non-empty
                    .map(([k, v]) => ({ key: k, value: v }))
            };

            const saveRes = await fetch("/api/admin/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (saveRes.ok) {
                setSettings(newSettings);
                setFiles({ monthlyFeeQr: null, contributionQr: null });
                alert("Settings saved successfully!");
            } else {
                throw new Error("Failed to save settings to database");
            }
        } catch (error) {
            console.error(error);
            alert(error.message || "An error occurred while saving.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="p-8 text-center text-gray-500">Loading settings...</div>;

    const renderUploadSection = (title, description, key) => (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-500 mb-4">{description}</p>

            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-[#065f46] transition-colors relative bg-gray-50">
                <div className="space-y-1 text-center w-full max-w-sm mx-auto">
                    {(files[key] || settings[key]) ? (
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-48 h-48 relative rounded-xl overflow-hidden bg-white shadow-sm border p-2">
                                <img
                                    src={files[key] ? URL.createObjectURL(files[key]) : settings[key]}
                                    alt={title}
                                    className="h-full w-full object-contain"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => handleRemoveFile(key)}
                                className="text-sm font-medium text-red-600 flex items-center gap-1 hover:text-red-700 bg-red-50 px-3 py-1.5 rounded-full"
                            >
                                <X size={14} /> Remove QR
                            </button>
                        </div>
                    ) : (
                        <div className="py-8">
                            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <div className="flex text-sm text-gray-600 justify-center">
                                <label className="relative cursor-pointer rounded-md font-medium text-[#065f46] hover:text-[#007049]">
                                    <span>Upload a QR code</span>
                                    <input type="file" className="sr-only" accept="image/*" onChange={(e) => handleFileChange(key, e)} />
                                </label>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">PNG, JPG up to 5MB</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 font-outfit flex items-center gap-2">
                        <SettingsIcon className="text-emerald-600" />
                        System Settings
                    </h1>
                    <p className="text-gray-500 mt-1">Manage global system configurations and assets</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-[#065f46] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#007049] transition-all disabled:opacity-50 shadow-sm"
                >
                    <Save size={18} />
                    {isSaving ? "Saving..." : "Save Changes"}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                {renderUploadSection(
                    "Monthly Fee QR Code",
                    "Displayed to citizens when they are paying their regular monthly fees.",
                    "monthlyFeeQr"
                )}

                {renderUploadSection(
                    "General Contribution QR Code",
                    "Displayed in the public site and citizen dashboard for general donations.",
                    "contributionQr"
                )}
            </div>
        </div>
    );
}
