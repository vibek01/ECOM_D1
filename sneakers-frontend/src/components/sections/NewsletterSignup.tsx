import { AppContainer } from "../layout/AppContainer"
import { Button } from "../common/Button"
import { Input } from "../common/Input"

export const NewsletterSignup = () => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Handle form submission logic here
    }

    return (
        <section className="bg-slate-50 py-20 sm:py-28">
            <AppContainer>
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        Stay Ahead of the Game
                    </h2>
                    <p className="mt-4 text-lg leading-8 text-slate-600">
                        Join our newsletter for exclusive drops, early access, and special offers.
                    </p>
                    <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row items-center gap-4">
                        <Input 
                            type="email"
                            placeholder="Enter your email"
                            required
                            className="w-full sm:flex-1"
                            aria-label="Email address"
                        />
                        <Button type="submit" size="lg" className="w-full sm:w-auto">
                            Subscribe
                        </Button>
                    </form>
                </div>
            </AppContainer>
        </section>
    )
}