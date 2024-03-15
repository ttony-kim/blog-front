export default function MenuItem({ icon, title, action, isActive = null }) {
  return (
    <div>
      <button
        className={`menu-item${isActive && isActive() ? " is-active" : ""}`}
        onClick={action}
        title={title}
      >
        <i className={`ri-${icon}`}></i>
      </button>
    </div>
  );
}
