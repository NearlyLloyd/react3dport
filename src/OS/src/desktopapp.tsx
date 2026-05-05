
interface DesktopAppProps {
    name: string;
    icon: string;
    onClick: () => void;
}

export default function DesktopApp(Props: DesktopAppProps) {
  return (
    <div className="desktopApp" onClick={Props.onClick}>
        <img src={Props.icon} width={48} height={48} alt={Props.name} />
        <span>{Props.name}</span>
    </div>
  );
}