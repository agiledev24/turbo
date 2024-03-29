import router from "next/router";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const ZeroCreditsAlert = () => {
  const router = useRouter();
  return (
    <Alert className="max-w-[500px]">
      <AlertTitle>You run out of credits!</AlertTitle>
      <AlertDescription>
        In order to generate more images and videos, you need to buy more
        credits.
        <div className="flex justify-end w-full mt-2">
          <Button
            onClick={() =>
              router.push(process.env.NEXT_PUBLIC_CREDIT_PAYMENT_GATEWAY_URL!)
            }
          >
            Buy More Credits
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export { ZeroCreditsAlert };
