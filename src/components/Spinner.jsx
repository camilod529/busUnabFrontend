export const Spinner = () => {
  return (
    <div className="h-100 m-auto position-absolute top-50 start-50 translate-middle">
      <div className="spinner-border text-primary align-self-center" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};
