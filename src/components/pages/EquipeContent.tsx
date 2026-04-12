import React from 'react';
import Hero from '@/components/ui/Hero';
import { equipeContent } from '@/data/content';
import { usePageJsonContent } from '@/hooks/usePageJsonContent';
import EditableText from '@/components/admin/EditableText';
import EditableImage from '@/components/admin/EditableImage';
import { useEditSession } from '@/contexts/EditSessionContext';
import { Plus, Trash2 } from 'lucide-react';

type EquipeData = typeof equipeContent;

const EquipeContent: React.FC = () => {
  const { value: data } = usePageJsonContent<EquipeData>('equipe', equipeContent);
  const { isEditing, updateAtPath } = useEditSession<EquipeData>() || {};

  const addMember = () => {
    if (!updateAtPath || !data) return;
    const newMembers = [
      ...data.members,
      {
        name: 'Nouveau membre',
        title: 'Titre / Fonction',
        description: 'Description du membre de l\'équipe.',
        photo: '/placeholder.svg',
      },
    ];
    updateAtPath('members', newMembers);
  };

  const removeMember = (index: number) => {
    if (!updateAtPath || !data) return;
    const newMembers = data.members.filter((_, i) => i !== index);
    updateAtPath('members', newMembers);
  };

  return (
    <>
      <Hero
        title={data.hero.title}
        subtitle={data.hero.subtitle}
        description={data.hero.description}
        size="medium"
      />

      <section className="py-16 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {data.members.map((member, index) => (
              <div
                key={index}
                className="group relative rounded-lg overflow-hidden bg-gray-900 shadow-lg cursor-pointer transition-transform duration-300 hover:scale-105 hover:z-10 hover:shadow-2xl"
              >
                {/* Photo */}
                <div className="aspect-[2/3] relative overflow-hidden">
                  <EditableImage
                    path={`members.${index}.photo`}
                    src={member.photo}
                    alt={member.name}
                    folder="equipe"
                    className="w-full h-full"
                    imgClassName="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-50"
                  />

                  {/* Gradient overlay — always visible at bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Default info — name + title at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 transition-all duration-300 group-hover:translate-y-[-30px]">
                    <EditableText
                      as="h3"
                      path={`members.${index}.name`}
                      value={member.name}
                      className="text-white font-bold text-sm md:text-base leading-tight drop-shadow-lg"
                    />
                    <EditableText
                      as="p"
                      path={`members.${index}.title`}
                      value={member.title}
                      className="text-orange-400 text-xs md:text-sm font-medium mt-0.5 drop-shadow"
                    />
                  </div>

                  {/* Hover reveal — description */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <EditableText
                      as="p"
                      multiline
                      path={`members.${index}.description`}
                      value={member.description}
                      className="text-gray-300 text-[11px] md:text-xs leading-relaxed line-clamp-4"
                    />
                  </div>

                  {/* Admin: delete button */}
                  {isEditing && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeMember(index);
                      }}
                      className="absolute top-2 right-2 z-30 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 shadow-lg"
                      title="Supprimer ce membre"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Admin: add member card */}
            {isEditing && (
              <button
                onClick={addMember}
                className="aspect-[2/3] rounded-lg border-2 border-dashed border-gray-600 bg-gray-900/50 flex flex-col items-center justify-center gap-3 text-gray-400 hover:border-orange-500 hover:text-orange-400 transition-colors"
              >
                <Plus className="w-10 h-10" />
                <span className="text-sm font-semibold">Ajouter un membre</span>
              </button>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default EquipeContent;
