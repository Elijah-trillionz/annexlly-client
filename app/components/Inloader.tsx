export default function Inloader({ del }: { del?: boolean }) {
  return (
    <span
      className={`w-[21px] h-[21px] rounded-full border-t-2 ${
        del ? `border-t-[tomato]` : 'border-t-secondary'
      } border-2 border-white animate-spin`}
    ></span>
  );
}
