"use client";
import { Show, useClerk, UserButton } from "@clerk/nextjs";
const Navbar = () => {
  const { openSignIn, openSignUp } = useClerk();
  return (
    <section className="navbar">
      <div className="py-1 flex-8 px-5 text-2xl">
        <a href={"/"}>Namaste Bites</a>
      </div>
      <div className="flex-2 px-5 flex gap-1 items-center justify-center">
        <Show when="signed-out">
          <AuthButton
            label="Sign In"
            className="
              border
              border-gray-300
              text-gray-300
              "
            onClick={() => openSignIn()}
          />
          <AuthButton
            label="Sign Up"
            className="
              bg-gray-300
              text-gray-900
              "
            onClick={() => openSignUp()}
          />
        </Show>
        <Show when="signed-in">
          <UserButton
            appearance={{
              options: {
                shimmer: true,
              },
              elements: {
                avatarBox: {
                  height: "2rem",
                  width: "2rem",
                },
              },
            }}
          />
        </Show>
      </div>
    </section>
  );
};

const AuthButton = (props: {
  label: string;
  className: string;
  onClick: () => void;
}) => {
  return (
    <button
      className={
        `
      flex-1 px-4 py-3
      cursor-pointer rounded-xl ` + props.className
      }
      onClick={props.onClick}
    >
      {props.label}
    </button>
  );
};
export default Navbar;
