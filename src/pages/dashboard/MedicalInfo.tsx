import React, { useState, useEffect, KeyboardEvent } from 'react';
import { Button } from '../../components/ui/button.tsx';
import { Input } from '../../components/ui/input.tsx';
import { Alert, AlertDescription } from '../../components/ui/alert.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select.tsx';
import { Badge } from '../../components/ui/badge.tsx';
import { useAuthContext } from '../../contexts/AuthContext.tsx';
import { medicalService } from '../../services/api.ts';
import { 
  Heart, 
  Droplet, 
  Pill, 
  Stethoscope, 
  Scissors, 
  Plus, 
  X, 
  Save, 
  Edit3, 
  Trash2, 
  Shield,
  AlertTriangle,
  CheckCircle,
  Loader2,
  FileText
} from 'lucide-react';

interface MedicalData {
  tipo_sanguineo: string;
  alergias: string[];
  medicamentos: string[];
  doencas: string[];
  cirurgias: string[];
}

interface TagInputProps {
  label: string;
  placeholder: string;
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  disabled?: boolean;
  icon?: React.ReactNode;
  variant?: 'default' | 'destructive';
}

interface SelectTagInputProps {
  label: string;
  options: string[];
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  disabled?: boolean;
  allowCustom?: boolean;
  icon?: React.ReactNode;
}

const TagInput: React.FC<TagInputProps> = ({ 
  label, 
  placeholder, 
  tags, 
  onTagsChange, 
  disabled = false,
  icon,
  variant = 'default'
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      if (!tags.includes(inputValue.trim())) {
        onTagsChange([...tags, inputValue.trim()]);
      }
      setInputValue('');
    }
  };

  const removeTag = (indexToRemove: number) => {
    onTagsChange(tags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="space-y-2">
      <label className="text-xs md:text-sm font-medium text-foreground flex items-center gap-2">
        {icon}
        {label}
      </label>
      <div className="space-y-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
        />
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <Badge 
                key={index} 
                variant={variant === 'destructive' ? 'destructive' : 'default'}
                className="flex items-center gap-1"
              >
                {tag}
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="text-xs hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const SelectTagInput: React.FC<SelectTagInputProps> = ({ 
  label, 
  options, 
  tags, 
  onTagsChange, 
  disabled = false,
  allowCustom = true,
  icon
}) => {
  const [customValue, setCustomValue] = useState('');

  const addTag = (newTag: string) => {
    if (!tags.includes(newTag)) {
      onTagsChange([...tags, newTag]);
    }
  };

  const handleSelectChange = (value: string) => {
    if (value && value !== 'custom') {
      addTag(value);
    }
  };

  const handleCustomSubmit = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && customValue.trim()) {
      e.preventDefault();
      addTag(customValue.trim());
      setCustomValue('');
    }
  };

  const removeTag = (indexToRemove: number) => {
    onTagsChange(tags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="space-y-2">
      <label className="text-xs md:text-sm font-medium text-foreground flex items-center gap-2">
        {icon}
        {label}
      </label>
      <div className="space-y-2">
        <div className="flex gap-2">
          <Select onValueChange={handleSelectChange} disabled={disabled}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder={`Selecione uma ${label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {options.map(option => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
              {allowCustom && (
                <SelectItem value="custom">Outro...</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        
        {allowCustom && (
          <Input
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            onKeyDown={handleCustomSubmit}
            placeholder={`Digite uma ${label.toLowerCase()} personalizada`}
            disabled={disabled}
          />
        )}
        
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {tag}
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="text-xs hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const MedicalInfo: React.FC = () => {
  const { user } = useAuthContext();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  const [medicalData, setMedicalData] = useState<MedicalData>({
    tipo_sanguineo: '',
    alergias: [],
    medicamentos: [],
    doencas: [],
    cirurgias: []
  });

  const [originalData, setOriginalData] = useState<MedicalData>({
    tipo_sanguineo: '',
    alergias: [],
    medicamentos: [],
    doencas: [],
    cirurgias: []
  });

  const tiposSanguineos = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  
  // Lista de alergias mais comuns
  const alergiasComuns = [
    'Poeira doméstica',
    'Pólen',
    'Ácaros',
    'Pelos de animais',
    'Penicilina',
    'Aspirina',
    'Dipirona',
    'Ibuprofeno',
    'Diclofenaco',
    'Paracetamol',
    'Leite',
    'Ovo',
    'Soja',
    'Trigo (Glúten)',
    'Amendoim',
    'Castanhas',
    'Frutos do mar',
    'Peixe',
    'Chocolate',
    'Morango',
    'Tomate',
    'Látex',
    'Níquel',
    'Perfumes',
    'Produtos de limpeza',
    'Tintas',
    'Iodo',
    'Contraste radiológico',
    'Anestésicos locais',
    'Sulfas'
  ];

  // Carregar dados médicos
  useEffect(() => {
    const loadMedicalData = async () => {
      try {
        const response = await medicalService.getMedicalInfo();
        if (response.data.success && response.data.data) {
          const data = response.data.data;
          const medicalInfo = {
            tipo_sanguineo: data.tipo_sanguineo || '',
            alergias: data.alergias || [],
            medicamentos: data.medicamentos || [],
            doencas: data.doencas || [],
            cirurgias: data.cirurgias || []
          };
          setMedicalData(medicalInfo);
          setOriginalData(medicalInfo);
        }
      } catch (error) {
        console.error('Erro ao carregar informações médicas:', error);
        setAlert({ type: 'error', message: 'Erro ao carregar informações médicas' });
      } finally {
        setInitialLoading(false);
      }
    };

    loadMedicalData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    try {
      const response = await medicalService.updateMedicalInfo({
        tipo_sanguineo: medicalData.tipo_sanguineo || undefined,
        alergias: medicalData.alergias,
        medicamentos: medicalData.medicamentos,
        doencas: medicalData.doencas,
        cirurgias: medicalData.cirurgias
      });

      if (response.data.success) {
        setAlert({ type: 'success', message: 'Informações médicas atualizadas com sucesso!' });
        setOriginalData({ ...medicalData });
        setIsEditing(false);
      }
    } catch (error: any) {
      console.error('Erro ao atualizar informações médicas:', error);
      
      let errorMessage = 'Erro ao atualizar informações médicas';
      if (error.response?.data?.errors && error.response.data.errors.length > 0) {
        const validationErrors = error.response.data.errors.map((err: any) => 
          `${err.field}: ${err.message}`
        ).join(', ');
        errorMessage = `Erro de validação: ${validationErrors}`;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      setAlert({ type: 'error', message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setMedicalData({ ...originalData });
    setIsEditing(false);
    setAlert(null);
  };

  const clearAllData = async () => {
    if (window.confirm('Tem certeza que deseja limpar todas as informações médicas? Esta ação não pode ser desfeita.')) {
      try {
        setLoading(true);
        await medicalService.clearMedicalInfo();
        
        const emptyData = {
          tipo_sanguineo: '',
          alergias: [],
          medicamentos: [],
          doencas: [],
          cirurgias: []
        };
        
        setMedicalData(emptyData);
        setOriginalData(emptyData);
        setAlert({ type: 'success', message: 'Informações médicas removidas com sucesso!' });
        setIsEditing(false);
      } catch (error) {
        setAlert({ type: 'error', message: 'Erro ao limpar informações médicas' });
      } finally {
        setLoading(false);
      }
    }
  };

  if (initialLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-4 md:space-y-6 px-4 md:px-0">
        <Card>
          <CardContent className="flex items-center justify-center py-8 md:py-12">
            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 md:h-6 md:w-6 animate-spin" />
              <span className="text-sm md:text-base text-muted-foreground">Carregando informações médicas...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const hasAnyData = medicalData.tipo_sanguineo || 
                    medicalData.alergias.length > 0 || 
                    medicalData.medicamentos.length > 0 || 
                    medicalData.doencas.length > 0 || 
                    medicalData.cirurgias.length > 0;

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
          <div className="flex items-center gap-2 md:gap-3">
            <Heart className="h-5 w-5 md:h-6 md:w-6 text-red-600" />
            <div>
              <CardTitle className="text-lg md:text-2xl font-bold">Informações Médicas</CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Gerencie suas informações médicas de forma segura
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content */}
      <Card>
        <CardHeader className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <FileText className="h-4 w-4 md:h-5 md:w-5" />
                {hasAnyData ? 'Suas Informações Médicas' : 'Adicionar Informações Médicas'}
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">
                {hasAnyData ? 'Visualize e edite suas informações' : 'Preencha suas informações médicas'}
              </CardDescription>
            </div>
            <div className="flex gap-2 md:gap-3">
              {hasAnyData && !isEditing && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={clearAllData}
                  disabled={loading}
                  className="text-xs md:text-sm"
                >
                  <Trash2 className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                  <span className="hidden sm:inline"></span>Limpar Dados
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 md:p-6">
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            {/* Tipo Sanguíneo */}
            <div className="space-y-2">
              <label className="text-xs md:text-sm font-medium text-foreground flex items-center gap-2">
                <Droplet className="h-4 w-4 text-red-600" />
                Tipo Sanguíneo
              </label>
              <Select 
                value={medicalData.tipo_sanguineo} 
                onValueChange={(value) => setMedicalData(prev => ({ ...prev, tipo_sanguineo: value }))}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione seu tipo sanguíneo" />
                </SelectTrigger>
                <SelectContent>
                  {tiposSanguineos.map(tipo => (
                    <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Alergias */}
            <SelectTagInput
              label="Alergias"
              options={alergiasComuns}
              tags={medicalData.alergias}
              onTagsChange={(tags) => setMedicalData(prev => ({ ...prev, alergias: tags }))}
              disabled={!isEditing}
              allowCustom={true}
              icon={<AlertTriangle className="h-4 w-4 text-yellow-600" />}
            />

            {/* Medicamentos */}
            <TagInput
              label="Medicamentos Utilizados"
              placeholder="Digite o nome do medicamento e pressione Enter"
              tags={medicalData.medicamentos}
              onTagsChange={(tags) => setMedicalData(prev => ({ ...prev, medicamentos: tags }))}
              disabled={!isEditing}
              icon={<Pill className="h-4 w-4 text-blue-600" />}
              variant="default"
            />

            {/* Doenças */}
            <TagInput
              label="Doenças Já Diagnosticadas"
              placeholder="Digite o nome da doença e pressione Enter"
              tags={medicalData.doencas}
              onTagsChange={(tags) => setMedicalData(prev => ({ ...prev, doencas: tags }))}
              disabled={!isEditing}
              icon={<Stethoscope className="h-4 w-4 text-purple-600" />}
              variant="default"
            />

            {/* Cirurgias */}
            <TagInput
              label="Cirurgias Realizadas"
              placeholder="Digite o nome da cirurgia e pressione Enter"
              tags={medicalData.cirurgias}
              onTagsChange={(tags) => setMedicalData(prev => ({ ...prev, cirurgias: tags }))}
              disabled={!isEditing}
              icon={<Scissors className="h-4 w-4 text-green-600" />}
              variant="default"
            />

            {/* Botões de ação */}
            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4 pt-4 md:pt-6 border-t">
              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    type="button"
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
                    <span className="hidden sm:inline">Salvar </span>Alterações
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setIsEditing(true)}
                  type="button"
                  size="sm"
                  className="text-xs md:text-sm"
                >
                  <Edit3 className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                  {hasAnyData ? 'Editar Informações' : 'Adicionar Informações'}
                </Button>
              )}
            </div>
          </form>

          {/* Informações de segurança */}
          {!isEditing && (
            <Alert className="mt-4 md:mt-6">
              <Shield className="h-4 w-4" />
              <AlertDescription className="text-xs md:text-sm">
                <strong>Suas informações estão seguras:</strong> Todas as informações médicas são criptografadas com AES-256 e só podem ser acessadas por você ou pessoas autorizadas via link público com senha.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicalInfo; 