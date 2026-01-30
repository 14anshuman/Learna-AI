import React, { useState, useEffect } from 'react';
import { Plus, Upload, FileText, X } from 'lucide-react';
import toast from 'react-hot-toast';
import documentService from '../../services/documentService.js';
import Button from '../../components/common/Button.jsx';
import DocumentCard from '../../components/documents/DocumentCard.jsx';
import Spinner from '../../components/common/Spinner.jsx';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../../components/common/PageTransition.jsx';

const DocumentsList = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);

    // Upload modal
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [uploadFile, setUploadFile] = useState(null);
    const [uploadTitle, setUploadTitle] = useState('');
    const [uploading, setUploading] = useState(false);

    // Delete modal
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState(null);


    const navigate=useNavigate();
    // Fetch documents
    const fetchDocuments = async () => {
        try {
            const data = await documentService.getDocuments();
            setDocuments(data || []);
        } catch (error) {
            toast.error('Failed to fetch documents.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    // Handle file select
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploadFile(file);
            setUploadTitle(file.name.replace(/\.[^/.]+$/, ''));
        }
    };

    // Upload document
    const handleUpload = async (e) => {
        e.preventDefault();

        if (!uploadFile || !uploadTitle) {
            toast.error('Please provide a title and select a file.');
            return;
        }

        setUploading(true);

        const formData = new FormData();
        formData.append('file', uploadFile);
        formData.append('title', uploadTitle);

        try {
            await documentService.uploadDocument(formData);
            toast.success('Document uploaded successfully!');
            setIsUploadModalOpen(false);
            setUploadFile(null);
            setUploadTitle('');
            setLoading(true);
            fetchDocuments();
        } catch (error) {
            toast.error('Failed to upload document.');
            console.log(error.message)
            navigate("/documents")
        } finally {
            setUploading(false);
             setIsUploadModalOpen(false);
            setUploadFile(null);
            setUploadTitle('');
            setLoading(true);
             fetchDocuments();
        }
    };

    // Delete handlers
    const handleDeleteRequest = (doc) => {
        setSelectedDoc(doc);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedDoc) return;

        setDeleting(true);
        try {
            await documentService.deleteDocument(selectedDoc._id);
            toast.success(`'${selectedDoc.title}' deleted.`);
            setDocuments((prev) =>
                prev.filter((d) => d._id !== selectedDoc._id)
            );
            setIsDeleteModalOpen(false);
            setSelectedDoc(null);
        } catch (error) {
            toast.error('Failed to delete document.');
        } finally {
            setDeleting(false);
        }
    };

    // Content renderer
    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex justify-center py-20">
                    <Spinner size={48} />
                </div>
            );
        }

        if (documents.length === 0) {
            return (
                <div className="flex items-center justify-center py-20">
                    <div className="w-full text-center bg-white rounded-2xl shadow-md p-8">
                        <div className="mx-auto mb-4 flex items-center justify-center h-14 w-14 rounded-full bg-indigo-100">
                            <FileText className="h-7 w-7 text-green-700" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            No Documents Yet
                        </h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Upload your first PDF document to begin learning.
                        </p>
                        <Button onClick={() => setIsUploadModalOpen(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Upload Document
                        </Button>
                    </div>
                </div>
            );
        }

        return (
            <div className=" sm:grid-cols-2    xl:grid-cols-4 gap-5">
                {documents.map((doc) => (
                    <DocumentCard
                        key={doc._id}
                        document={doc}
                    
                        onDelete={handleDeleteRequest}
                    />
                ))}
            </div>
        );
    };

    return (
        <PageTransition>
        <div className="min-h-screen relative">
            {/* Background */}
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900 mb-2">
                            My Documents
                        </h1>
                        <p className="text-slate-500 text-sm">
                            Manage and organize your learning materials
                        </p>
                    </div>

                    <Button onClick={() => setIsUploadModalOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Upload Document
                    </Button>
                </div>

                {renderContent()}
            </div>

            {/* ================= Upload Modal ================= */}
            {isUploadModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() =>
                            !uploading && setIsUploadModalOpen(false)
                        }
                    />

                    <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold">
                                Upload Document
                            </h2>
                            <button
                                onClick={() =>
                                    !uploading && setIsUploadModalOpen(false)
                                }
                            >
                                <X />
                            </button>
                        </div>

                        <form onSubmit={handleUpload} className="space-y-4">
                            <input
                                type="text"
                                value={uploadTitle}
                                onChange={(e) =>
                                    setUploadTitle(e.target.value)
                                }
                                placeholder="Document title"
                                className="w-full border rounded-lg px-3 py-2"
                            />

                            <label className="flex flex-col items-center gap-2 px-4 py-6 border-2 border-dashed rounded-xl cursor-pointer hover:border-indigo-400">
                                <Upload className="text-green-600" />
                                <p className="text-sm text-gray-600">
                                    {uploadFile
                                        ? uploadFile.name
                                        : 'Click to upload PDF'}
                                </p>
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </label>

                            <div className="flex justify-end gap-3">
                                <Button
                                    variant="secondary"
                                    type="button"
                                    onClick={() =>
                                        setIsUploadModalOpen(false)
                                    }
                                    disabled={uploading}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={uploading}>
                                    {uploading ? 'Uploading…' : 'Upload'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ================= Delete Modal ================= */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/40" />

                    <div className="relative bg-white rounded-xl p-6 w-full max-w-sm">
                        <h3 className="font-semibold text-gray-900 mb-2">
                            Delete Document
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Are you sure you want to delete{' '}
                            <strong>{selectedDoc?.title}</strong>?
                        </p>

                        <div className="flex justify-end gap-3">
                            <Button
                                variant="secondary"
                                onClick={() =>
                                    setIsDeleteModalOpen(false)
                                }
                                disabled={deleting}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="danger"
                                onClick={handleConfirmDelete}
                                disabled={deleting}
                            >
                                {deleting ? 'Deleting…' : 'Delete'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
        </PageTransition>
    );
};

export default DocumentsList;
