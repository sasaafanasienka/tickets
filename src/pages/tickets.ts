const API_URL_1 = 'https://www.ryanair.com/api/farfnd/v4/oneWayFares/WMI/CFU/cheapestPerDay?outboundMonthOfDate=2025-05-15&currency=EUR';
const API_URL_2 = 'https://www.ryanair.com/api/farfnd/v4/oneWayFares/CFU/GDN/cheapestPerDay?outboundMonthOfDate=2025-05-15&currency=EUR';

const BOT_TOKEN = '6425131021:AAHc3BdjwcjysIvqjwHrJH0HcWyGAOaQ8nI';

const CHAT_ID = '227431181';

const tickets = async (request: Request, env: Env, ctx: ExecutionContext): Promise<Response> => {
	const tickets = await Promise.all([fetch(API_URL_1), fetch(API_URL_2)])
		.then((responses) => Promise.all(responses.map((response) => response.json())))
		.then((data) => data);

	const ticket1 = (tickets[0] as any).fares.find((fare: any) => fare.day === '2025-05-19')?.price?.value;
	const ticket2 = (tickets[1] as any).fares.find((fare: any) => fare.day === '2025-05-27')?.price?.value;

	const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

	await fetch(telegramUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			chat_id: 227431181,
			text: ticket1 && ticket2 ? `Tickets: ${ticket1 + ticket2}` : 'Tickets not found',
		}),
	});

	return new Response(ticket1 && ticket2 ? `Tickets: ${ticket1 + ticket2}` : 'Tickets not found');
};

export default tickets;
