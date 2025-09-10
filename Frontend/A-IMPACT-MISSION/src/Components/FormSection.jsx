import React from "react";
import BusinessInputs from "../Form/Components/BusinessInputs";
import SubmitButton from "../Form/Components/SubmitButton";

export default function FormSection({
  size,
  setSize,
  seating,
  setSeating,
  gas,
  setGas,
  delivery,
  setDelivery,
  loading,
  onSubmit,
}) {
  return (
    <form onSubmit={onSubmit}>
      <BusinessInputs
        size={size}
        setSize={setSize}
        seating={seating}
        setSeating={setSeating}
        gas={gas}
        setGas={setGas}
        delivery={delivery}
        setDelivery={setDelivery}
      />
      <SubmitButton loading={loading} />
    </form>
  );
}
