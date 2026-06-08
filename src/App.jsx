import { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import AddClientModal from "./components/AddClientModal";
import ClientCard from "./components/ClientCard";
import Header from "./components/Header";
import LoginScreen from "./components/LoginScreen";
import { isAllowedEmail } from "./config/auth";
import { isCloudConfigured, supabase } from "./lib/supabase";

const STORAGE_KEY = "proc-client-work-tracker";

function normalizeClients(clients) {
  return clients.map((client) => {
    if (Array.isArray(client.jobs)) {
      return {
        ...client,
        jobs: client.jobs.map((job) => ({
          ...job,
          notes: Array.isArray(job.notes) ? job.notes : [],
        })),
      };
    }

    const hasLegacyJob =
      client.project ||
      client.jobsite ||
      client.status ||
      (Array.isArray(client.notes) && client.notes.length > 0);

    return {
      id: client.id,
      name: client.name,
      jobs: hasLegacyJob
        ? [
            {
              id: crypto.randomUUID(),
              project: client.project || "Original Project",
              jobsite: client.jobsite || "Location not specified",
              status: client.status || "Standby",
              notes: Array.isArray(client.notes) ? client.notes : [],
            },
          ]
        : [],
    };
  });
}

function loadClients() {
  try {
    const savedClients = localStorage.getItem(STORAGE_KEY);
    if (!savedClients) return [];

    return normalizeClients(JSON.parse(savedClients));
  } catch {
    return [];
  }
}

export default function App() {
  const [clients, setClients] = useState(loadClients);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [session, setSession] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(!isCloudConfigured);
  const [isCloudReady, setIsCloudReady] = useState(!isCloudConfigured);
  const [cloudError, setCloudError] = useState("");
  const localClientsAtStartup = useRef(clients);

  useEffect(() => {
    if (!isCloudConfigured) return undefined;

    let isActive = true;
    supabase.auth.getSession().then(({ data, error }) => {
      if (!isActive) return;
      if (error) setCloudError(error.message);
      if (data.session && !isAllowedEmail(data.session.user.email)) {
        supabase.auth.signOut();
        setSession(null);
      } else {
        setSession(data.session);
      }
      setIsAuthReady(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!isActive) return;
      if (nextSession && !isAllowedEmail(nextSession.user.email)) {
        supabase.auth.signOut();
        setSession(null);
        setIsAuthReady(true);
        return;
      }
      setSession(nextSession);
      setIsAuthReady(true);
      if (!nextSession) setIsCloudReady(false);
    });

    return () => {
      isActive = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!isCloudConfigured || !session) return undefined;

    let isActive = true;

    const loadCloudData = async () => {
      setIsCloudReady(false);
      const { data, error } = await supabase
        .from("app_state")
        .select("clients")
        .eq("id", "main")
        .maybeSingle();

      if (!isActive) return;
      if (error) {
        setCloudError(error.message);
        setIsCloudReady(true);
        return;
      }

      if (data) {
        setClients(normalizeClients(data.clients || []));
      } else {
        const { error: insertError } = await supabase.from("app_state").insert({
          id: "main",
          clients: localClientsAtStartup.current,
          updated_at: new Date().toISOString(),
        });
        if (insertError) setCloudError(insertError.message);
      }

      setIsCloudReady(true);
    };

    loadCloudData();
    return () => {
      isActive = false;
    };
  }, [session]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));

    if (!isCloudConfigured || !session || !isCloudReady) return undefined;

    const saveTimer = window.setTimeout(async () => {
      const { error } = await supabase.from("app_state").upsert({
        id: "main",
        clients,
        updated_at: new Date().toISOString(),
      });

      setCloudError(error?.message || "");
    }, 500);

    return () => window.clearTimeout(saveTimer);
  }, [clients, session, isCloudReady]);

  const addClient = (client) => {
    setClients((currentClients) => [
      ...currentClients,
      { ...client, id: crypto.randomUUID(), jobs: [] },
    ]);
    setIsClientModalOpen(false);
  };

  const addJob = (clientId, job) => {
    setClients((currentClients) =>
      currentClients.map((client) =>
        client.id === clientId
          ? {
              ...client,
              jobs: [
                ...client.jobs,
                { ...job, id: crypto.randomUUID(), notes: [] },
              ],
            }
          : client,
      ),
    );
  };

  const deleteJob = (clientId, jobId) => {
    setClients((currentClients) =>
      currentClients.map((client) =>
        client.id === clientId
          ? {
              ...client,
              jobs: client.jobs.filter((job) => job.id !== jobId),
            }
          : client,
      ),
    );
  };

  const addNote = (clientId, jobId, note) => {
    setClients((currentClients) =>
      currentClients.map((client) =>
        client.id === clientId
          ? {
              ...client,
              jobs: client.jobs.map((job) =>
                job.id === jobId
                  ? {
                      ...job,
                      notes: [
                        ...job.notes,
                        { ...note, id: crypto.randomUUID() },
                      ],
                    }
                  : job,
              ),
            }
          : client,
      ),
    );
  };

  const deleteNote = (clientId, jobId, noteId) => {
    setClients((currentClients) =>
      currentClients.map((client) =>
        client.id === clientId
          ? {
              ...client,
              jobs: client.jobs.map((job) =>
                job.id === jobId
                  ? {
                      ...job,
                      notes: job.notes.filter((note) => note.id !== noteId),
                    }
                  : job,
              ),
            }
          : client,
      ),
    );
  };

  const updateNote = (clientId, jobId, noteId, updatedNote) => {
    setClients((currentClients) =>
      currentClients.map((client) =>
        client.id === clientId
          ? {
              ...client,
              jobs: client.jobs.map((job) =>
                job.id === jobId
                  ? {
                      ...job,
                      notes: job.notes.map((note) =>
                        note.id === noteId
                          ? { ...note, ...updatedNote }
                          : note,
                      ),
                    }
                  : job,
              ),
            }
          : client,
      ),
    );
  };

  const deleteClient = (clientId) => {
    setClients((currentClients) =>
      currentClients.filter((client) => client.id !== clientId),
    );
  };

  if (!isAuthReady || (isCloudConfigured && session && !isCloudReady)) {
    return (
      <div className="relative grid min-h-screen place-items-center overflow-hidden">
        <div className="ambient ambient-one" />
        <div className="ambient ambient-two" />
        <p className="relative z-10 text-sm font-bold text-slate-300">
          Loading tracker...
        </p>
      </div>
    );
  }

  if (isCloudConfigured && !session) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <div className="ambient ambient-one" />
        <div className="ambient ambient-two" />
        <div className="ambient ambient-three" />
        <LoginScreen />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="ambient ambient-three" />

      <main className="relative z-10 mx-auto w-full max-w-4xl px-4 pb-20 pt-6 sm:px-8 sm:pt-10">
        <Header
          userEmail={session?.user?.email}
          onSignOut={
            isCloudConfigured ? () => supabase.auth.signOut() : undefined
          }
        />

        {cloudError && (
          <p className="mt-4 rounded-xl border border-rose-300/15 bg-rose-500/5 px-4 py-3 text-xs leading-5 text-rose-100">
            Cloud sync needs attention: {cloudError}
          </p>
        )}

        <section className="mt-8 sm:mt-10" aria-label="Client work list">
          <div className="brand-panel mb-6 flex min-h-28 items-center justify-center overflow-hidden rounded-[2rem] px-8 py-7 sm:min-h-36">
            <img
              src="/proc-logo.png"
              alt="Pro-C Solution"
              className="h-20 w-auto max-w-full object-contain sm:h-28"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setIsClientModalOpen(true)}
              className="primary-button group inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold"
            >
              <Plus
                size={15}
                strokeWidth={2.5}
                className="transition-transform duration-300 group-hover:rotate-90"
              />
              Add New Client
            </button>
          </div>

          <div className="mt-6 space-y-4">
            {clients.length === 0 ? (
              <div className="glass-panel rounded-[2rem] px-6 py-12 text-center sm:px-10">
                <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl border border-cyan-300/20 bg-cyan-300/5 text-cyan-200 shadow-[0_0_30px_rgba(34,211,238,0.12)]">
                  <Plus size={30} />
                </div>
                <h2 className="text-xl font-bold text-white">
                  Your client list is ready
                </h2>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400 sm:text-base">
                  Add your first client, then create jobs and save notes inside
                  each job.
                </p>
              </div>
            ) : (
              clients.map((client) => (
                <ClientCard
                  key={client.id}
                  client={client}
                  onAddJob={addJob}
                  onDeleteJob={deleteJob}
                  onAddNote={addNote}
                  onUpdateNote={updateNote}
                  onDeleteNote={deleteNote}
                  onDeleteClient={deleteClient}
                />
              ))
            )}
          </div>
        </section>
      </main>

      <AddClientModal
        isOpen={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}
        onSave={addClient}
      />
    </div>
  );
}
