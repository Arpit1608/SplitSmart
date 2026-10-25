import { initials } from '../../utils/format';

export default function Avatar({ name, color = '', title, style }) {
  return (
    <div className={`avatar ${color}`.trim()} title={title} style={style}>
      {initials(name)}
    </div>
  );
}
