const EmptyState = ({ message = "No data available" }) => {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
          <img
            src="/empty.svg"
            alt="empty"
            style={{ maxWidth: "300px", marginBottom: "10px" }}
          />
        <p style={{ fontSize: "16px", color: "#666" }}>{message}</p>
      </div>
    );
  };

export default EmptyState;  
  