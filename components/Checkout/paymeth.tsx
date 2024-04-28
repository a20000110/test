import { useTranslations } from "next-intl";

const paymentMethods = [
  { id: "paypal", title: "PayPal" }
];
export default function PayMeth() {
  const t = useTranslations();
  return <>
    <div className="mt-10 border-t border-gray-200 pt-10">
      <h2 className="text-lg font-medium text-gray-900">{t("order.Payment_method")}</h2>
      <fieldset className="mt-4">
        <legend className="sr-only">Payment type</legend>
        <div className="space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
          {paymentMethods.map((paymentMethod, paymentMethodIdx) => (
            <div key={paymentMethod.id} className="flex items-center">
              {paymentMethodIdx === 0 ? (
                <input
                  id={paymentMethod.id}
                  name="payment-type"
                  type="radio"
                  defaultChecked
                  className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              ) : (
                <input
                  id={paymentMethod.id}
                  name="payment-type"
                  type="radio"
                  className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              )}
              <label htmlFor={paymentMethod.id} className="ml-3 block text-sm font-medium text-gray-700">
                {paymentMethod.title}
              </label>
            </div>
          ))}
        </div>
      </fieldset>
    </div>
  </>;
}
