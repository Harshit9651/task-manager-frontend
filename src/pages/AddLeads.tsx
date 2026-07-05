import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Building2, User, Mail, Phone, Linkedin, Globe, FileText,
  CheckCircle2, UserPlus, Save, Loader2,
} from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import leadService from "../lib/services/lead.service";
import { showToast } from "../utils/toast";
import type { CreateLeadRequest, LeadStatus, LeadTemperature, ILead } from "../types/lead";

const initialForm: CreateLeadRequest = {
  company: "", contactName: "", designation: "", email: "", phone: "",
  linkedin: "", website: "", country: "", city: "", source: "manual",
  companySize: "1-10", temperature: "unknown", status: "new", notes: "", tags: [],
};

// Map a fetched lead onto the editable form shape.
const leadToForm = (lead: ILead): CreateLeadRequest => ({
  company: lead.company ?? "",
  contactName: lead.contactName ?? "",
  designation: lead.designation ?? "",
  email: lead.email ?? "",
  phone: lead.phone ?? "",
  linkedin: lead.linkedin ?? "",
  website: lead.website ?? "",
  country: lead.country ?? "",
  city: lead.city ?? "",
  source: lead.source ?? "manual",
  companySize: lead.companySize ?? "1-10",
  temperature: lead.temperature ?? "unknown",
  status: lead.status ?? "new",
  notes: lead.notes ?? "",
  tags: lead.tags ?? [],
});

export default function AddLeads() {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState<CreateLeadRequest>(initialForm);
  const [baseForm, setBaseForm] = useState<CreateLeadRequest>(initialForm); // for "Reset"
  const [fetching, setFetching] = useState<boolean>(Boolean(id));
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // In edit mode, load the lead and prefill.
  useEffect(() => {
    if (!id) return;
    let active = true;
    (async () => {
      try {
        setFetching(true);
        const res = await leadService.getLead(id);
        const lead = (res as { data: { lead: ILead } }).data.lead;
        if (!active) return;
        const mapped = leadToForm(lead);
        setForm(mapped);
        setBaseForm(mapped);
      } catch (err) {
        console.error(err);
        showToast.error("Could not load lead.");
        navigate(-1);
      } finally {
        if (active) setFetching(false);
      }
    })();
    return () => { active = false; };
  }, [id, navigate]);

  const update = <K extends keyof CreateLeadRequest>(key: K, value: CreateLeadRequest[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.company.trim()) next.company = "Company is required";
    if (!form.contactName.trim()) next.contactName = "Contact name is required";
    if (!form.email.trim()) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Invalid email";
    if (form.website && !/^https?:\/\/|^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/.test(form.website))
      next.website = "Invalid website";
    if (form.linkedin && !form.linkedin.includes("linkedin.com")) next.linkedin = "Invalid LinkedIn URL";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  // Reset back to the original values (empty for create, fetched lead for edit).
  const resetForm = () => {
    setForm(baseForm);
    setErrors({});
    setSubmitted(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setLoading(true);
      if (isEditMode && id) {
        await leadService.updateLead(id, form);
        showToast.success("Lead updated successfully!");
        navigate(-1); // back to Total Leads
      } else {
        await leadService.createLead(form);
        showToast.success("Lead created successfully!");
        setSubmitted(true);
        resetForm();
      }
    } catch (error) {
      showToast.error(isEditMode ? "Unable to update lead." : "Unable to create lead.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Pipeline"
        title={isEditMode ? "Edit Lead" : "Add Lead"}
        description={
          isEditMode
            ? "Update this prospect's details — including status."
            : "Capture a new prospect's details to kick off your outreach."
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6 sm:p-8">
            {fetching ? (
              <div className="flex items-center justify-center gap-3 py-16 text-sm text-ink-400">
                <Loader2 className="h-5 w-5 animate-spin" /> Loading lead…
              </div>
            ) : (
              <>
                {submitted && !isEditMode && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 flex items-center gap-3 rounded-xl bg-success-50 px-4 py-3 text-success-600"
                  >
                    <CheckCircle2 className="h-5 w-5 shrink-0" />
                    <p className="text-sm font-medium">Lead added successfully! It now appears in Total Leads.</p>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <Input
                        label="Company Name"
                        icon={<Building2 className="h-4 w-4" />}
                        value={form.company}
                        onChange={(e) => update("company", e.target.value)}
                      />
                      {errors.company && <p className="mt-1 text-xs text-danger-500">{errors.company}</p>}
                    </div>
                    <div>
                      <Input
                        label="Contact Name"
                        icon={<User className="h-4 w-4" />}
                        value={form.contactName}
                        onChange={(e) => update("contactName", e.target.value)}
                      />
                      {errors.contactName && <p className="mt-1 text-xs text-danger-500">{errors.contactName}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Input
                      label="Designation"
                      placeholder="Founder / CEO / CTO"
                      value={form.designation}
                      onChange={(e) => update("designation", e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <Input
                        label="Email address"
                        type="email"
                        icon={<Mail className="h-4 w-4" />}
                        placeholder="sarah.chen@company.com"
                        value={form.email}
                        onChange={(e) => update('email', e.target.value)}
                      />
                      {errors.email && <p className="mt-1 text-xs text-danger-500">{errors.email}</p>}
                    </div>
                    <Input
                      label="Phone number"
                      icon={<Phone className="h-4 w-4" />}
                      placeholder="+1 (415) 555-0182"
                      value={form.phone}
                      onChange={(e) => update('phone', e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Input
                      label="LinkedIn profile"
                      icon={<Linkedin className="h-4 w-4" />}
                      placeholder="linkedin.com/in/username"
                      value={form.linkedin}
                      onChange={(e) => update('linkedin', e.target.value)}
                    />
                    <Input
                      label="Website"
                      icon={<Globe className="h-4 w-4" />}
                      placeholder="company.com"
                      value={form.website}
                      onChange={(e) => update('website', e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Select
                      label="Lead Temperature"
                      value={form.temperature}
                      onChange={(e) => update("temperature", e.target.value as LeadTemperature)}
                    >
                      <option value="hot">🔥 Hot</option>
                      <option value="warm">🟡 Warm</option>
                      <option value="cold">🔵 Cold</option>
                      <option value="unknown">⚪ Unknown</option>
                    </Select>

                    <Select
                      label="Lead Status"
                      value={form.status}
                      onChange={(e) => update("status", e.target.value as LeadStatus)}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="follow_up">Follow Up</option>
                      <option value="meeting_scheduled">Meeting Scheduled</option>
                      <option value="proposal_sent">Proposal Sent</option>
                      <option value="negotiation">Negotiation</option>
                      <option value="won">Won</option>
                      <option value="lost">Lost</option>
                        <option value="converted_to_client">Converted to Client</option>
                    </Select>
                  </div>

                  <label className="block">
                    <span className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-ink-700">
                      <FileText className="h-3.5 w-3.5" /> Notes
                    </span>
                    <textarea
                      rows={4}
                      placeholder="Any relevant context about this lead..."
                      value={form.notes}
                      onChange={(e) => update('notes', e.target.value)}
                      className="w-full rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-sm text-ink-800 placeholder:text-ink-400 outline-none transition-all focus:border-brand-400 focus:ring-4 focus:ring-brand-100 resize-none"
                    />
                  </label>

                  <div className="flex items-center gap-3 pt-2">
                    <Button
                      type="submit"
                      disabled={loading}
                      icon={
                        loading ? <Loader2 className="h-4 w-4 animate-spin" />
                          : isEditMode ? <Save className="h-4 w-4" />
                          : <UserPlus className="h-4 w-4" />
                      }
                    >
                      {loading
                        ? (isEditMode ? "Saving…" : "Creating Lead...")
                        : (isEditMode ? "Save Changes" : "Add Lead")}
                    </Button>

                    <Button type="button" variant="outline" disabled={loading} onClick={resetForm}>
                      {isEditMode ? "Reset" : "Clear Form"}
                    </Button>

                    {isEditMode && (
                      <Button type="button" variant="outline" disabled={loading} onClick={() => navigate(-1)}>
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </>
            )}
          </Card>
        </div>

        {/* Tips panel */}
        <div>
          <Card className="p-6 sticky top-20">
            <h3 className="text-sm font-semibold text-ink-800 mb-3">Tips for better lead data</h3>
            <ul className="space-y-3 text-sm text-ink-500">
              <li className="flex gap-2.5"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand-500 shrink-0" />Use the work email — it improves deliverability tracking later.</li>
              <li className="flex gap-2.5"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand-500 shrink-0" />Add a LinkedIn URL to unlock enrichment once automation ships.</li>
              <li className="flex gap-2.5"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand-500 shrink-0" />Notes are searchable — mention pain points or objections.</li>
              <li className="flex gap-2.5"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand-500 shrink-0" />Set an accurate status so pipeline reports stay reliable.</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}