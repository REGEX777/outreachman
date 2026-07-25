export default function ConfirmationModal(){
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-[#111113] rounded-xl p-6">
                <p>Delete this upload?</p>
            </div>
        </div>
    )
}