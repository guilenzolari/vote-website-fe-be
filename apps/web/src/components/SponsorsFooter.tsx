import interfaceData from "../assets/interface.json";
import logoConsultoriaDavidGomes from "../assets/sponsors/logo-consultoria-david-gomes.png";
import logoDiCapri from "../assets/sponsors/logo-di-capri.png";
import logoGuaco from "../assets/sponsors/logo-guaco.png";
import logoLaveteria from "../assets/sponsors/logo-laveteria.png";
import logoMercadoBob from "../assets/sponsors/logo-mercado-bob.png";
import logoTusca from "../assets/sponsors/logo-tusca.png";
import logoWizard from "../assets/sponsors/logo-wizard.png";
import "./SponsorsFooter.css";

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
    <footer className="sponsors-footer">
      <h4 className="sponsors-title">{footer.sponsors}</h4>
      <div className="sponsors-grid">
        {sponsorLogos.map((logo, index) => (
          <div key={index} className="sponsor-card">
            <img
              src={logo}
              alt={`Patrocinador ${index + 1}`}
              className="sponsor-logo"
            />
          </div>
        ))}
      </div>
    </footer>
  );
};
