
interface DesktopAppProps {
    name: string;
    icon: string;
    onClick: () => void;
}

export default function DesktopApp({ name, icon, onClick }: DesktopAppProps) {
  return (
    <div className="desktopApp" onClick={onClick}>
        <img src={icon} width={68} height={68} alt={name}/>
        <span>{name}</span>
    </div>
  );
}