"use client";

import { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import { Skeleton } from "./ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Building, Car, Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { cn } from "~/lib/utils";

export type VehicleType = "carros" | "motos" | "caminhoes";

interface VehicleSearchProps {
  onVehicleSelected: (data: { 
    brandCode: string; 
    modelCode: string; 
    yearCode: string; 
    vehicleType: VehicleType;
  } | null) => void;
}

export const VehicleSearch = ({ onVehicleSelected }: VehicleSearchProps) => {
  const [selectedVehicleType, setSelectedVehicleType] = useState<VehicleType>("carros");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const [openVehicleType, setOpenVehicleType] = useState(false);
  const [openBrand, setOpenBrand] = useState(false);
  const [openModel, setOpenModel] = useState(false);
  const [openYear, setOpenYear] = useState(false);

  const { data: brands, isLoading: isLoadingBrands } = api.fipe.getBrands.useQuery(
    { vehicleType: selectedVehicleType },
  );

  const { data: models, isLoading: isLoadingModels } = api.fipe.getModels.useQuery(
    { brandCode: selectedBrand, vehicleType: selectedVehicleType },
    { enabled: !!selectedBrand }
  );
  const { data: years, isLoading: isLoadingYears } = api.fipe.getYears.useQuery(
    { brandCode: selectedBrand, modelCode: selectedModel, vehicleType: selectedVehicleType },
    { enabled: !!selectedModel && !!selectedModel }
  );

  const handleVehicleTypeChange = (value: VehicleType) => {
    setSelectedVehicleType(value);

    setSelectedBrand("");
    setSelectedModel("");
    setSelectedYear("");
  }

  const handleBrandChange = (value: string) => {
    setSelectedBrand(value);
    setSelectedModel("");
    setSelectedYear("");
  }

  const handleModelChange = (value: string) => {
    setSelectedModel(value);
    setSelectedYear("");
  }

  const handleYearChange = (value: string) => {
    setSelectedYear(value);
  }

  useEffect(() => {
    if (selectedVehicleType && selectedBrand && selectedModel && selectedYear) {
      onVehicleSelected({
        vehicleType: selectedVehicleType,
        brandCode: selectedBrand,
        modelCode: selectedModel,
        yearCode: selectedYear
      });
    } else {
      onVehicleSelected(null);
    }
  }, [selectedVehicleType, selectedBrand, selectedModel, selectedYear, onVehicleSelected]);

  const vehicleTypes = [
    { value: "carros", label: "Carros e utilitários pequenos" },
    { value: "motos", label: "Motos" },
    { value: "caminhoes", label: "Caminhões e micro-ônibus" },
  ];

  const findVehicleTypeLabel = (type: string) => vehicleTypes.find(v => v.value === type)?.label ?? "";
  const findBrandLabel = (code: string) => brands?.find(b => b.codigo === code)?.nome ?? "";
  const findModelLabel = (code: string) => models?.find(m => m.codigo === code)?.nome ?? "";
  const findYearLabel = (code: string) => years?.find(y => y.codigo === code)?.nome ?? "";

  return (
      <div className="container mx-auto">
        <div className="flex flex-col justify-center sm:flex-row gap-4 sm:gap-2 w-full max-w-4xl mx-auto">

          <Popover 
            open={openVehicleType} 
            onOpenChange={setOpenVehicleType}
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline" 
                role="combobox"
                aria-expanded={openVehicleType}
                className="w-full sm:w-auto sm:max-w-[18rem] justify-between text-sm"
              >
                <Car className="mr-2 h-4 w-4" />
                {selectedVehicleType ? findVehicleTypeLabel(selectedVehicleType) : "Tipo de veículo"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto min-w-[14rem] max-w-[20rem] p-0">
              <Command>
                <CommandInput placeholder="Buscar tipo..." />
                <CommandList>
                  <CommandEmpty>Nenhum tipo encontrado.</CommandEmpty>
                  <CommandGroup>
                    {vehicleTypes.map((type) => (
                      <CommandItem
                        key={type.value}
                        value={type.value}
                        onSelect={() => handleVehicleTypeChange(type.value as VehicleType)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedVehicleType === type.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {type.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <Popover open={openBrand} onOpenChange={setOpenBrand}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openBrand}
                className="w-full sm:w-auto sm:min-w-[16rem] sm:max-w-[24rem] justify-between text-sm"
              >
                <Building className="mr-2 h-4 w-4" />
                {selectedBrand ? findBrandLabel(selectedBrand) : "Selecione a Marca"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto min-w-[16rem] max-w-[26rem] p-0">
              <Command>
                <CommandInput placeholder="Buscar marca..." />
                <CommandList>
                  {isLoadingBrands ? (
                    <div className="p-4">
                      <Skeleton className="h-8 w-full mb-2" />
                      <Skeleton className="h-8 w-full mb-2" />
                      <Skeleton className="h-8 w-full" />
                    </div>
                  ) : (
                    <>
                      <CommandEmpty>Nenhuma marca encontrada.</CommandEmpty>
                      <CommandGroup>
                        {brands?.map((brand) => (
                          <CommandItem
                            key={brand.codigo}
                            value={`${brand.codigo}-${brand.nome}`}
                            onSelect={() => handleBrandChange(brand.codigo)}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedBrand === brand.codigo ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {brand.nome}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <Popover open={openModel} onOpenChange={setOpenModel}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openModel}
                disabled={!selectedBrand}
                className={cn(
                  "w-full sm:w-auto sm:min-w-[16rem] sm:max-w-[24rem] justify-between text-sm",
                  !selectedBrand && "opacity-50 cursor-not-allowed"
                )}
              >
                {selectedModel ? findModelLabel(selectedModel) : "Selecione o Modelo" }
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto min-w-[16rem] max-w-[26rem] p-0">
              <Command>
                <CommandInput placeholder="Buscar modelo..." />
                <CommandList>
                  {isLoadingModels ? (
                    <div className="p-4">
                      <Skeleton className="h-8 w-full mb-2" />
                      <Skeleton className="h-8 w-full mb-2" />
                      <Skeleton className="h-8 w-full" />
                    </div>
                  ) : selectedBrand ? (
                    <>
                      <CommandEmpty>Nenhum modelo encontrado.</CommandEmpty>
                      <CommandGroup>
                        {models?.map((model) => (
                          <CommandItem
                            key={model.codigo}
                            value={`${model.codigo}-${model.nome}`}
                            onSelect={() => handleModelChange(model.codigo)}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedModel === model.codigo ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {model.nome}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </>
                  ) : (
                    <div className="p-4 text-sm text-gray-500 text-center">
                      Selecione uma marca primeiro
                    </div>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <Popover open={openYear} onOpenChange={setOpenYear}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openYear}
                disabled={!selectedBrand || !selectedModel}
                className={cn(
                  "w-full sm:w-auto sm:min-w-[12rem] sm:max-w-[16rem] justify-between text-sm",
                  (!selectedBrand || !selectedModel) && "opacity-50 cursor-not-allowed"
                )}
              >
                {selectedYear ? findYearLabel(selectedYear) : "Selecione o Ano" }
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto min-w-[12rem] max-w-[18rem] p-0">
              <Command>
                <CommandInput placeholder="Buscar ano..." />
                <CommandList>
                  {isLoadingYears ? (
                    <div className="p-4">
                      <Skeleton className="h-8 w-full mb-2" />
                      <Skeleton className="h-8 w-full mb-2" />
                      <Skeleton className="h-8 w-full" />
                    </div>
                  ) : selectedBrand && selectedModel ? (
                    <>
                      <CommandEmpty>Nenhum ano encontrado.</CommandEmpty>
                      <CommandGroup>
                        {years?.map((year) => (
                          <CommandItem
                            key={year.codigo}
                            value={`${year.codigo}-${year.nome}`}
                            onSelect={() => handleYearChange(year.codigo)}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedYear === year.codigo ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {year.nome}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </>
                  ) : (
                    <div className="p-4 text-sm text-gray-500 text-center">
                      {!selectedBrand ? "Selecione uma marca primeiro" : "Selecione um modelo primeiro"}
                    </div>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>
  );
};
