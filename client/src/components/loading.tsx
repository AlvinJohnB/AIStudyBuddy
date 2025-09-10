import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useContext } from "react";
import LoadingContext from "../contexts/LoadingContext";
import { Spinner } from "@/components/ui/shadcn-io/spinner";

export default function Loading() {
  const { isLoading } = useContext(LoadingContext);

  return (
    <Dialog open={isLoading}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex mx-auto">
            Loading <Spinner variant="ellipsis" />
          </DialogTitle>
          <DialogDescription>Please wait while we process your request. This may take a few moments.</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
