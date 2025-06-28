import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { PrimeReactProvider } from 'primereact/api'
import { AuthProvider } from '@/context/AuthContext'
import { FormProvider } from '@/context/FormContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'Form Flow - Class Action Form Management',
	description:
		'Create, manage, and share custom forms for class action lawsuits',
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang='en'>
			<body className={inter.className}>
				<PrimeReactProvider>
					<AuthProvider>
						<FormProvider>{children}</FormProvider>
					</AuthProvider>
				</PrimeReactProvider>
			</body>
		</html>
	)
}
