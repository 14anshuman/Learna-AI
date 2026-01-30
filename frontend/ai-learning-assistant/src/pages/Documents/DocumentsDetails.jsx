import React,{useState,useEffect} from 'react'
import { useParams, Link } from 'react-router-dom'
import documentService from '../../services/documentService'
import Spinner from '../../components/common/Spinner'
import toast from 'react-hot-toast'
import {ArrowLeft,ExternalLink} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader'
import Tabs from '../../components/common/Tabs'
import ChatInterface from '../../components/chat/ChatInterface'
import AIActions from '../../components/ai/AIActions'
import FlashcardManager from '../../components/flashcards/FlashcardManager'
import QuizManager from '../../components/quizzes/QuizManager'
import PageTransition from '../../components/common/PageTransition'

const DocumentsDetails = () => {
  const {id}=useParams();
  const [document,setDocument]= useState(null);
  const [loading,setLoading]=useState(true);
  const [activeTab,setActiveTab] = useState('content');

  useEffect(() => {
    const fetchDocumentDetails=async()=>{
      try {
        const data=await documentService.getDocumentById(id);
        
        
        setDocument(data);
      } catch (error) {
        toast.error('Failed to fetch document details.')
        console.error(error);
      }finally{
        setLoading(false);
      }
    }
    fetchDocumentDetails();
  }, [id])

  const getPdfUrl=()=>{
    if(!document?.data?.fileUrl) return null;
    
    const filePath=document.data.fileUrl;
    if (
  filePath.startsWith("http://") ||
  filePath.startsWith("https://")
) {
  return filePath;
}

    // console.log(filePath);
    

    const baseUrl= '';
    return `${baseUrl}${filePath.startsWith('/')? '' : '/'}${filePath}`;
  
  }

  // console.log(document);

  const renderContent=()=>{
    if(loading){
      return <Spinner/>;
    }
    if(!document || !document.data || !document.data.fileUrl){
      return <div className=''>PDF not available.</div>;
    }
    const pdfUrl=getPdfUrl();
    // console.log(pdfUrl);
    

   return (
  <div className="flex flex-col bg-white rounded-2xl border overflow-hidden h-[85vh]">

    
    {/* Header */}
    <div className="flex items-center justify-between px-5 py-3 border-b bg-gray-50">
      <span className="text-sm font-semibold text-gray-800">
        Document Viewer
      </span>

      <a
        href={pdfUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700"
      >
        <ExternalLink size={16} />
        Open in new tab
      </a>
    </div>

    {/* PDF Viewer */}
    <iframe
      src={pdfUrl}
      title="PDF Viewer"
      className="flex-1 w-full"
    />
  </div>
);

  }


  const renderChat=()=>{
    return <ChatInterface/>
  }

  const renderAIActions=()=>{
    return <AIActions/>
  }

  const renderFlashcardsTab=()=>{
    return <FlashcardManager documentId={id} />
  }

  const renderQuizzesTab=()=>{
    return <QuizManager documentId={id}/>
  }

  const tabs = [
    { name: 'content', label: 'Content', content: renderContent() },
    { name: 'chat', label: 'Chat', content: renderChat() },
    { name: 'ai-actions', label: 'AI Actions', content: renderAIActions() },
    { name: 'flashcards', label: 'Flashcards', content: renderFlashcardsTab() },
    { name: 'quizzes', label: 'Quizzes', content: renderQuizzesTab() },
];

 if (loading) {
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Spinner size={48} />
        </div>
    );
}

if(!document){
  return <div className="text-center p-8">Document not found.</div>
}


  return (
    <PageTransition>
<div>
      <div className="mb-4">
        <Link to="/documents" className='inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors'>
        <ArrowLeft size={16}/>
        Back to Documents
        </Link>
      </div>
      <PageHeader title={document.data.title}/>
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab}/>
    </div>
      
    </PageTransition>
    
  )
}

export default DocumentsDetails