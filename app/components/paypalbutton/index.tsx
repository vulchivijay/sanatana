import { FC } from 'react';
import Image from 'next/image';

interface PayPalButtonProps {
  /** PayPal payment link */
  link: string;
  /** Button text (default: "Pay Now") */
  buttonText?: string;
  /** Show cards image below button (default: true) */
  showCardsImage?: boolean;
  /** Show "Powered by PayPal" section (default: true) */
  showPoweredBy?: boolean;
}

const PayPalButton: FC<PayPalButtonProps> = ({
  link,
  buttonText = "Pay Now",
  showCardsImage = true,
  showPoweredBy = true,
}) => {

  return (
    <>
      {showPoweredBy && (
        <div className="mx-auto w-6/12 flex flex-col items-center">
          <div>
            <Image src="/images/SANATANADHARM-qrcode.png" alt="PayPal QR Code" width={200} height={200} />
          </div>

          <div className="mx-auto w-6/12 flex flex-col items-center text-center gap-4">
            {showCardsImage && (<Image src="/images/Debit_Credit_APM.svg" alt="Debit Credit APM" width={200} height={120} />)}
            <small className="inline-flex flex-nowrap">Powered by</small>
            {/* Inline PayPal Wordmark SVG */}
            <div className="mx-auto w-4/12">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 100 32"

              >
                <path
                  fill="#003087"
                  d="M10.6 0H0l-3.1 19.6h7.1l.8-5.1h3.5c6.1 0 9.7-3.1 10.6-9.3C19.8 1.8 16.8 0 10.6 0zM9.6 10.1H6.3l1.1-6.9h3.3c2.4 0 3.8.8 3.4 3.3-.4 2.4-1.9 3.6-4.5 3.6z"
                />
                <path
                  fill="#009CDE"
                  d="M23.4 0h-7.1l-3.1 19.6h7.1l.8-5.1h3.5c6.1 0 9.7-3.1 10.6-9.3C32.6 1.8 29.6 0 23.4 0zM22.4 10.1h-3.3l1.1-6.9h3.3c2.4 0 3.8.8 3.4 3.3-.4 2.4-1.9 3.6-4.5 3.6z"
                />
                {/* Add remaining paths for full logo */}
              </svg>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PayPalButton;