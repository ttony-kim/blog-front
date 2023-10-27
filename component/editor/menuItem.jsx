import css from "styled-jsx/css";

const style = css`
  .menu-item {
    background-color: transparent;
    border: none;
    border-radius: 0.4rem;
    color: #fff;
    cursor: pointer;
    height: 1.75rem;
    margin-right: 0.25rem;
    padding: 0.25rem;
    width: 1.75rem;
  }
  .menu-item:hover {
    background-color: #303030;
  }
  .menu-item .is-active {
    background-color: #303030;
  }
  .menu-item i {
    fill: currentColor;
    height: 100%;
    width: 100%;
  }
`;

export default function MenuItem({ icon, title, action, isActive = null }) {
  // console.log(isActive);
  return (
    <div>
      <button
        className={`menu-item${isActive && isActive() ? " is-active" : ""}`}
        onClick={action}
        title={title}
      >
        <i className={`ri-${icon}`}></i>
      </button>
      <style jsx>{style}</style>
    </div>
  );
}
