import { useParams } from "wouter";
import PasteView from "@/components/feature/PasteView";

export default function Paste() {
  const { id } = useParams();
  
  if (!id) {
    return (
      <div className="py-8 text-center">
        <h1 className="text-2xl font-bold mb-4 text-red-500">Invalid Paste ID</h1>
        <p className="text-slate-300">The requested paste could not be found.</p>
      </div>
    );
  }
  
  return (
    <div className="py-8">
      <PasteView id={id} />
    </div>
  );
}
