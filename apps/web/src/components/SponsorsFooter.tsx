import interfaceData from "../assets/interface.json";
import logoConsultoriaDavidGomes from "../assets/sponsors/logo-consultoria-david-gomes.jpg";
import logoDiCapri from "../assets/sponsors/logo-di-capri.png";
import logoGuaco from "../assets/sponsors/logo-guaco.png";
import logoLaveteria from "../assets/sponsors/logo-laveteria.png";
import logoMercadoBob from "../assets/sponsors/logo-mercado-bob.png";
import logoTusca from "../assets/sponsors/logo-tusca.jpeg";
import logoWizard from "../assets/sponsors/logo-wizard.png";

const sponsorLogos = [
  logoConsultoriaDavidGomes,
  logoDiCapri,
  logoGuaco,
  logoLaveteria,
  logoMercadoBob,
  logoTusca,
  logoWizard,
];

export const SponsorsFooter = () => {
  const { footer } = interfaceData;

  return (
    <footer
      style={{
        width: "100%",
        backgroundColor: "var(--code-bg)",
        padding: "40px 20px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "24px",
      }}
    >
      <h4 style={{ opacity: 0.6, margin: 0 }}>{footer.sponsors}</h4>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "16px",
        }}
      >
        {sponsorLogos.map((logo, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",

              flex: "0 0 calc(25% - 12px)",
              minWidth: "140px",
            }}
          >
            <img
              src={logo}
              alt={`Patrocinador ${index + 1}`}
              style={{
                maxHeight: "200px",
                objectFit: "contain",
              }}
            />
          </div>
        ))}
      </div>
    </footer>
  );
};
