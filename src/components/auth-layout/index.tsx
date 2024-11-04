import { Col, Image, Row } from "antd";

type AuthenLayoutProps = {
  children: React.ReactNode;
};

function AuthenLayout({ children }: AuthenLayoutProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f0f2f5",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          width: "100%",
          padding: "40px",
          backgroundColor: "#fff",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
        }}
      >
        <Row align={"middle"} gutter={32} style={{ padding: "20px" }}>
          {/* Image Section */}
          <Col xs={24} md={12} style={{ textAlign: "center" }}>
            <Image
              src="https://workflow.com.vn/wp-content/uploads/2023/01/single_pod.jpg"
              alt="POD"
              style={{ maxWidth: "100%", borderRadius: "8px" }}
            />
          </Col>

          {/* Form Section */}
          <Col xs={24} md={12} style={{ padding: "0 20px" }}>
            {children}
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default AuthenLayout;
