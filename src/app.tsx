import { useEffect, useState } from "react"
import { useAppStore, useLocalStore } from "./store";
import axios, { AxiosError } from "axios";
import rateLimit from "axios-rate-limit";
import { Loader } from "./components/loader";
import { Item } from "./components/item";

export interface ILead {
    created_at: number;
    id: number;
    name: string;
    price: number
    tasks: {
        "id": number,
        "entity_id": number,   
        "entity_type": string,
        "text": string,
        "complete_till": number, 
        "is_completed": boolean   
    }[]
}

const App = () => {

    const http = rateLimit(axios.create(), { maxRequests: 3, perMilliseconds: 1000 });

    const { access_token } = useLocalStore(state => state)
    const {
        client_id,
        leads,
        setLeads,
        setOpenLead,
        page,
        setPage } = useAppStore(state => state);

    const { local_lead_task, setLocalLeadTask } = useLocalStore(state => state)
    const [error, setError] = useState<string | null>(null)
    const [loader, setLoader] = useState<number[] | [] | any>([])

    function auth() {
        window.open(`https://www.amocrm.ru/oauth?client_id=${client_id}&redirect_uri=http://localhost:3000/oauth`, 'Предоставить доступ', 'scrollbars, status, resizable, width=750, height=580');
    }

    async function getItem(page: number) {
        try {
            const response = await http.get("https://cors-anywhere.herokuapp.com/https://yabzhk.amocrm.ru/api/v4/leads", {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                params: {
                    page,
                    limit: 3,
                },
            });
            setError(null)
            return response.data._embedded;
        } catch (err: unknown) {
            const error = err as AxiosError
            if (error.response) {
                if (error.response.status === 429) {
                    throw new Error("Too Many Requests (429)");
                } else if (error.response.status === 423) {
                    throw new Error("Resource is locked (423)");
                } else {
                    throw new Error(`Unexpected error: ${error.response.status}`);
                }
            } else {
                return [];
            }
        }
    }

    async function getStatusItem(id: number) {
        try {
            const response = await http.get(`https://cors-anywhere.herokuapp.com/https://yabzhk.amocrm.ru/api/v4/tasks`, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                params: {
                    filter: {
                        entity_id: id,       
                        entity_type: 'leads',     
                    },
                    limit: 1
   
                },
            });
            setError(null)
            const tasks = response.data._embedded.tasks;
            return tasks;
        } catch (err: unknown) {
            const error = err as AxiosError
            if (error.response) {
                if (error.response.status === 429) {
                    throw new Error("Too Many Requests (429)");
                } else if (error.response.status === 423) {
                    throw new Error("Resource is locked (423)");
                } else {
                    throw new Error(`Unexpected error: ${error.response.status}`);
                }
            } else {
                return [];
            }
        }
    }


    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const data = await getItem(page);
                if (data.length === 0) return
                setLeads([...leads, ...data.leads]);
                setPage(page + 1);
                setError(null)
            } catch (err: unknown) {
                const error = err as AxiosError
                if (error.message === "Too Many Requests (429)" || error.message === "Resource is locked (423)") {
                    setError("Too Many Requests (429)")
                } else if (error.message === "Unexpected error: 401") {
                    setError("Unauthorized (401)")
                } else if (error.status == 204) {
                    setError(null)
                } else {
                    setError("Please, complete  cross-origin requests to anywhere https://cors-anywhere.herokuapp.com/")
                }
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [page]);

    useEffect(() => {
        if (!access_token) {
            auth()
        }
    }, [access_token])


    async function handleItem(id: number) {
        setLoader([...loader, id])
        const idx = loader.indexOf(id)
        setOpenLead(id)

        setTimeout(() => {
            setLoader([...loader.slice(0, idx), loader.slice(idx + 1)])
        }, 600)

        if (local_lead_task.find((elem:ILead) => elem.id == id)) return

        try {
            const data = await getStatusItem(id);
        if (local_lead_task.find((lead:ILead) => lead.id == id)) return
            setLocalLeadTask({...leads.find((elem:ILead) => elem.id == id), tasks: data});
            setError(null)
        } catch (err: unknown) {
            const error = err as AxiosError
            setError(error.message);
            if (error.message === "Too Many Requests (429)" || error.message === "Resource is locked (423)") {
                setError("Too Many Requests (429)")
            } else if (error.message === "Unexpected error: 401") {
                setError("Unauthorized (401)")
            } else {
                setError(null)
            }
        }
    }

    function injectData(el: ILead) {
        const local_id = local_lead_task.find((x:ILead) => x.id === el.id) 
        console.log(local_id)
        if (local_id) {
            return local_id
        }
        return el
    }

    return <div className="min-h-screen h-full bg-gray-400 text-gray-200">
        <div className="text-center py-3">{error && <div>{error}</div>}</div>
        <div className="max-w-screen-xl mx-auto flex flex-wrap justify-around gap-10 p-5">
            {leads && leads.map((el: ILead) => <div key={el.id} className="flex flex-col bg-gray-600 px-3 py-2 max-w-[240px] h-[110px] overflow-y-scroll mt-5 w-full border border-gray-300 gap-2 rounded-lg cursor-pointer hover:bg-gray-800/80 transition duration-400">
            {loader.find((id: number) => id == el.id) ?
                    <Loader /> : <Item onClick={() => handleItem(el.id)} data={injectData(el)} />
                }
            </div>)}
        </div>
    </div>
}

export default App
