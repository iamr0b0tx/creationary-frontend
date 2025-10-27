import { OctagonAlert } from "lucide-react";
import { Alert, AlertDescription } from "./alert";

export default function FormErrorDisplay({ message }: { message: string }) {
  return (
    <Alert variant="destructive" className="mb-4">
      <OctagonAlert className="h-4 w-4" />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
