export default function Footer() {
    return (
        <footer className="bg-primary-container text-surface-bright font-body-md text-body-md w-full py-stack-lg border-t-2 border-secondary flex flex-col md:flex-row justify-between items-center px-margin-mobile md:px-margin-desktop mt-auto shrink-0 z-30 relative">
            <div className="font-h2 text-h2 text-surface-bright mb-4 md:mb-0 uppercase">PlacePredict</div>
            <div className="text-surface-bright/80 mb-4 md:mb-0">© 2024 PlacePredict System</div>
            <div className="flex gap-4">
                <a className="text-surface-bright/80 hover:text-secondary-fixed transition-colors" href="#">Privacy Policy</a>
                <a className="text-surface-bright/80 hover:text-secondary-fixed transition-colors" href="#">Terms of Service</a>
                <a className="text-surface-bright/80 hover:text-secondary-fixed transition-colors" href="#">Support</a>
            </div>
        </footer>
    );
}
