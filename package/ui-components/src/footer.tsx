import Link from "next/link";

const Footer = () => {
  return (
    <div className="flex flex-wrap justify-between px-6 py-2 border-t-2 border-muted bg-background-paper sm:gap-4 ">
      <div className="text-xs">Powered by originstories.live</div>

      <div className="flex items-center gap-2 text-xs">
        <Link
          href="https://eu.jotform.com/form/240594613118051"
          target="_blank"
        >
          Waitlist
        </Link>
        <Link href="https://vpm.canny.io/feedbackandfeatures" target="_blank">
          Feedback
        </Link>
        <Link
          href="https://docs.google.com/document/d/1-U0Yz3N3FfCmfJH7_iTjsB_qEQbmvxRSxvIqd_kjAKs/edit?usp=sharing"
          target="_blank"
        >
          Terms and Conditions
        </Link>
      </div>
    </div>
  );
};

export { Footer };
