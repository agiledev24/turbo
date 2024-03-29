import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

export const SaveModal = ({
  open,
  limitReached,
  onOpenChange,
}: {
  open: boolean;
  limitReached: boolean;
  onOpenChange: any;
}) => {
  const router = useRouter();
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Saved to your gallery!</AlertDialogTitle>
          <AlertDialogDescription>
            Item has been saved to your gallery. Go to your gallery to see item.
            {limitReached && (
              <div className="mt-2">
                Unfortunately you've reached your current account limit for
                saved items. To get more you can buy more credits.
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() =>
              limitReached
                ? router.push(
                    process.env.NEXT_PUBLIC_CREDIT_PAYMENT_GATEWAY_URL!
                  )
                : router.push("/gallery")
            }
          >
            {limitReached ? "Buy More Credits" : "Go To Gallery"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
