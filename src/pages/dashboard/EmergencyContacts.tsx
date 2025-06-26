import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button.tsx';
import { Input } from '../../components/ui/input.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card.tsx';
import { Alert, AlertDescription } from '../../components/ui/alert.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select.tsx';
import { Badge } from '../../components/ui/badge.tsx';
import { 
  Users, 
  Plus, 
  UserPlus, 
  Phone, 
  User, 
  Heart,
  Edit3,
  Trash2,
  Save,
  X,
  CheckCircle,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { formatPhone } from '../../utils/validators.ts';
import { 
  emergencyContactService, 
  EmergencyContact, 
  CreateEmergencyContactData, 
  UpdateEmergencyContactData,
  apiUtils 
} from '../../services/api.ts';

interface FormData {
  nome_contato: string;
  parentesco: string;
  telefone_contato: string;
}

interface FormErrors {
  [key: string]: string;
}

const parentescoOptions = [
  'Cônjuge',
  'Pai',
  'Mãe',
  'Filho',
  'Filha',
  'Irmão',
  'Irmã',
  'Avô',
  'Avó',
  'Tio',
  'Tia',
  'Primo',
  'Prima',
  'Sogro',
  'Sogra',
  'Cunhado',
  'Cunhada',
  'Amigo',
  'Amiga',
  'Médico',
  'Médica',
  'Enfermeiro',
  'Enfermeira',
  'Cuidador',
  'Cuidadora',
  'Outro'
];

export const EmergencyContacts: React.FC = () => {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    nome_contato: '',
    parentesco: '',
    telefone_contato: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Carregar contatos de emergência
  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      setInitialLoading(true);
      const response = await emergencyContactService.getContacts();
      
      if (response.data.success && response.data.data) {
        setContacts(response.data.data);
      }
    } catch (error) {
      console.error('Erro ao carregar contatos:', error);
      setAlert({ 
        type: 'error', 
        message: apiUtils.handleApiError(error)
      });
    } finally {
      setInitialLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validar nome
    if (!formData.nome_contato.trim()) {
      newErrors.nome_contato = 'Nome é obrigatório';
    } else if (formData.nome_contato.trim().length < 2) {
      newErrors.nome_contato = 'Nome deve ter pelo menos 2 caracteres';
    }

    // Validar parentesco
    if (!formData.parentesco) {
      newErrors.parentesco = 'Parentesco é obrigatório';
    }

    // Validar telefone
    if (!formData.telefone_contato.trim()) {
      newErrors.telefone_contato = 'Telefone é obrigatório';
    } else if (formData.telefone_contato.replace(/\D/g, '').length < 10) {
      newErrors.telefone_contato = 'Telefone deve ter pelo menos 10 dígitos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));

    // Limpar erro do campo
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSelectChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setFormData(prev => ({
      ...prev,
      telefone_contato: formatted
    }));

    if (errors.telefone_contato) {
      setErrors(prev => ({
        ...prev,
        telefone_contato: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setAlert(null);

    try {
      if (editingContact) {
        // Editar contato existente
        const updateData: UpdateEmergencyContactData = {
          nome_contato: formData.nome_contato.trim(),
          parentesco: formData.parentesco,
          telefone_contato: formData.telefone_contato
        };
        
        const response = await emergencyContactService.updateContact(editingContact.id, updateData);
        
        if (response.data.success) {
          setAlert({ type: 'success', message: 'Contato atualizado com sucesso!' });
          await loadContacts(); // Recarregar lista
        }
      } else {
        // Adicionar novo contato
        const createData: CreateEmergencyContactData = {
          nome_contato: formData.nome_contato.trim(),
          parentesco: formData.parentesco,
          telefone_contato: formData.telefone_contato
        };
        
        const response = await emergencyContactService.createContact(createData);
        
        if (response.data.success) {
          setAlert({ type: 'success', message: 'Contato adicionado com sucesso!' });
          await loadContacts(); // Recarregar lista
        }
      }

      handleCloseForm();
    } catch (error) {
      console.error('Erro ao salvar contato:', error);
      setAlert({ 
        type: 'error', 
        message: apiUtils.handleApiError(error)
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (contact: EmergencyContact) => {
    setEditingContact(contact);
    setFormData({
      nome_contato: contact.nome_contato,
      parentesco: contact.parentesco || '',
      telefone_contato: contact.telefone_contato
    });
    setIsFormOpen(true);
    setErrors({});
    setAlert(null);
  };

  const handleDelete = async (contactId: number) => {
    if (window.confirm('Tem certeza que deseja excluir este contato?')) {
      try {
        setLoading(true);
        const response = await emergencyContactService.deleteContact(contactId);
        
        if (response.data.success) {
          setAlert({ type: 'success', message: 'Contato excluído com sucesso!' });
          await loadContacts(); // Recarregar lista
        }
      } catch (error) {
        console.error('Erro ao excluir contato:', error);
        setAlert({ 
          type: 'error', 
          message: apiUtils.handleApiError(error)
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleOpenForm = () => {
    setIsFormOpen(true);
    setEditingContact(null);
    setFormData({ nome_contato: '', parentesco: '', telefone_contato: '' });
    setErrors({});
    setAlert(null);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingContact(null);
    setFormData({ nome_contato: '', parentesco: '', telefone_contato: '' });
    setErrors({});
  };

  if (initialLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="flex items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="text-muted-foreground">Carregando contatos...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4 md:space-y-6 px-4 md:px-0">
      {alert && (
        <Alert variant={alert.type === 'error' ? 'destructive' : 'default'}>
          {alert.type === 'success' ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertTriangle className="h-4 w-4" />
          )}
          <AlertDescription className="text-sm">{alert.message}</AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <Card>
        <CardHeader className="border-b p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="flex items-center gap-2 md:gap-3">
              <Users className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
              <div>
                <CardTitle className="text-lg md:text-2xl font-bold">Contatos de Emergência</CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Gerencie seus contatos para situações de emergência
                </CardDescription>
              </div>
            </div>
            <Button onClick={handleOpenForm} disabled={loading} size="sm" className="text-xs md:text-sm">
              <Plus className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline"></span>Adicionar Contato
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Formulário */}
      {isFormOpen && (
        <Card>
          <CardHeader className="border-b p-4 md:p-6">
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <UserPlus className="h-4 w-4 md:h-5 md:w-5" />
              {editingContact ? 'Editar Contato' : 'Novo Contato'}
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">
              {editingContact 
                ? 'Atualize as informações do contato de emergência'
                : 'Preencha as informações do contato de emergência'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              {/* Nome */}
              <div className="space-y-2">
                <label htmlFor="nome_contato" className="text-sm font-medium text-foreground flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Nome Completo *
                </label>
                <Input
                  id="nome_contato"
                  type="text"
                  placeholder="Digite o nome completo"
                  value={formData.nome_contato}
                  onChange={handleInputChange('nome_contato')}
                />
                {errors.nome_contato && (
                  <p className="text-sm text-destructive">{errors.nome_contato}</p>
                )}
              </div>

              {/* Parentesco */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Parentesco/Relação *
                </label>
                <Select 
                  value={formData.parentesco} 
                  onValueChange={(value) => handleSelectChange('parentesco', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o parentesco" />
                  </SelectTrigger>
                  <SelectContent>
                    {parentescoOptions.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.parentesco && (
                  <p className="text-sm text-destructive">{errors.parentesco}</p>
                )}
              </div>

              {/* Telefone */}
              <div className="space-y-2">
                <label htmlFor="telefone_contato" className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Telefone *
                </label>
                <Input
                  id="telefone_contato"
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={formData.telefone_contato}
                  onChange={handlePhoneChange}
                />
                {errors.telefone_contato && (
                  <p className="text-sm text-destructive">{errors.telefone_contato}</p>
                )}
              </div>

              {/* Botões */}
              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseForm}
                  disabled={loading}
                  size="sm"
                  className="text-xs md:text-sm"
                >
                  <X className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  size="sm"
                  className="text-xs md:text-sm"
                >
                  {loading ? (
                    <Loader2 className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2 animate-spin" />
                  ) : (
                    <Save className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                  )}
                  {editingContact ? 'Atualizar' : 'Salvar'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de Contatos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Meus Contatos ({contacts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {contacts.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                Nenhum contato cadastrado
              </h3>
              <p className="text-muted-foreground mb-6">
                Adicione contatos de emergência para serem exibidos em situações críticas.
              </p>
              <Button onClick={handleOpenForm}>
                <UserPlus className="h-4 w-4 mr-2" />
                Adicionar Primeiro Contato
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {contacts.map((contact) => (
                <Card key={contact.id} className="bg-muted/30">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-primary/10 rounded-full">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground">{contact.nome_contato}</h4>
                          {contact.parentesco && (
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline">{contact.parentesco}</Badge>
                            </div>
                          )}
                          <div className="flex items-center gap-1 mt-2">
                            <Phone className="h-3 w-3 text-green-600" />
                            <span className="text-sm font-medium text-green-600">
                              {contact.telefone_contato}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(contact)}
                          disabled={loading}
                        >
                          <Edit3 className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(contact.id)}
                          disabled={loading}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Informações importantes */}
      {contacts.length > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Importante:</strong> Estes contatos serão exibidos em sua página pública de emergência. 
            Certifique-se de que os números estão corretos e atualizados.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default EmergencyContacts; 