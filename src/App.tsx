import React, { useEffect, useState } from "react";
import { useCheckoutPricing } from "@recurly/react-recurly";

import "./App.css";

type FormValues = {
  plan: string;
  postal_code?: string;
  country: "US";
};

function App() {
  // Form State
  const [values, setValues] = useState<FormValues>({
    plan: "bbq_club",
    postal_code: undefined,
    country: "US",
  });

  // Pricing State
  // BUG: `loading` is never set back to `false` if the API request fails.
  // REQUEST: add a way for me to access API errors. For example, make an `error` object available here.
  const [{ price, loading }, setCheckoutPricing] = useCheckoutPricing({
    subscriptions: [{ plan: values.plan }],
  });

  // Update pricing when the plan changes
  useEffect(() => {
    setCheckoutPricing({
      subscriptions: [{ plan: values.plan }],
      address: {
        // QUESTION: Why does the type definition demand `first_name` and `last_name`? They aren't needed AFAIK.
        first_name: "",
        last_name: "",
        country: values?.country,
        postal_code: values?.postal_code,
      },
    });
  }, [values?.plan, values?.postal_code, values?.country, setCheckoutPricing]);

  return (
    <main className="App">
      <div>
        <select
          name="plan"
          onChange={(event) =>
            setValues({ ...values, plan: event.target.value })
          }
        >
          <option
            value="digital_monthly"
            selected={values?.plan == "digital_monthly"}
          >
            Digital Monthly
          </option>
          <option value="bbq_club" selected={values?.plan == "bbq_club"}>
            BBQ Club
          </option>
        </select>
      </div>

      <div>
        <label htmlFor="postal_code">Postal Code</label>
        <input
          type="text"
          name="postal_code"
          id="postal_code"
          onChange={(event) =>
            setValues({ ...values, postal_code: event.target.value })
          }
        />
      </div>

      <div>{loading ? "Loading..." : price?.now?.total}</div>
    </main>
  );
}

export default App;
